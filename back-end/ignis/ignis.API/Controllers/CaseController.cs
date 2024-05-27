using ignis.Domain.Model.PostgreSQL;
using ignis.Domain.Model.RavenDB;
using ignis.Domain.Model.Request;
using ignis.Domain.Model.Response;
using ignis.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents.Session;
using Raven.Client.Documents.Session.TimeSeries;
using Serilog.Sinks.NewRelic.Logs.Sinks.NewRelicLogs;
using System.Globalization;
using System.Reflection;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class CaseController : Controller
    {
        private readonly ILogger<CaseController> _logger;
        private readonly DataContext _context;
        private readonly TagController _tagController;
        static double attributeThreshold = 0.5;

        public CaseController(ILogger<CaseController> logger, DataContext context, TagController tagController)
        {
            _logger = logger;
            _context = context;
            _tagController = tagController;
        }

        static string AddSpacesToCamelCase(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            var result = input[0].ToString();

            for (int i = 1; i < input.Length; i++)
            {
                // Insert a space before each uppercase letter
                if (char.IsUpper(input[i]))
                {
                    result += " ";
                }

                result += input[i];
            }

            return result;
        }

        // API for case
        // 1. Creating Case Draft (Unfinished form filling and filtering process)
        [HttpPost("CreateCaseDraft")]
        public async Task<ActionResult> CreateCaseDraft(CreateCaseRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            User? creator = await _context.User.FindAsync(request.creatorUserId);

            if (creator == null)
            {
                return BadRequest("User not found.");
            }

            if (request.caseId != null)
            {
                Case? _case = await _context.Case.FindAsync(request.caseId);

                if (_case == null)
                {
                    return BadRequest("Case not found.");
                }

                _case.Title = request.title;
                _case.Objective = request.objective;
                _case.CollaboratorUserId = request.collaboratorUserId;
                _case.StartTime = request.startTime;
                _case.EndTime = request.endTime;
                _case.PersonNumber = request.personNumber;
                _case.GeneralAttribute = request.generalAttribute;
                _case.ColorAttribute = request.colorAttribute;
                _case.TagId = request.tagId;
                _case.UpdatedAt = dateTime;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Case draft has been updated",
                    caseId = _case.CaseId
                });
            }
            else
            {
                Case _case = new Case()
                {
                    CaseId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Title = request.title,
                    Objective = request.objective,
                    CollaboratorUserId = request.collaboratorUserId,
                    StartTime = request.startTime,
                    EndTime = request.endTime,
                    PersonNumber = request.personNumber,
                    GeneralAttribute = request.generalAttribute,
                    ColorAttribute = request.colorAttribute,
                    TagId = request.tagId,
                    Status = "DRAFT",
                    CreatedAt = dateTime,
                    UpdatedAt = dateTime,
                    Creator = creator
                };

                _context.Case.Add(_case);

                Activity? activity = await _context.Activity
                    .Where(a => a.Type == "CASE" && a.Action == "DRAFT")
                    .FirstOrDefaultAsync();

                if (activity != null)
                {
                    CaseActivity caseActivity = new CaseActivity
                    {
                        CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                        CaseId = _case.CaseId,
                        ActivityId = activity.ActivityId,
                        RelatedId = null,
                        RelatedData = null,
                        UserId = request.creatorUserId,
                        CreatedAt = _case.CreatedAt
                    };

                    _context.CaseActivity.Add(caseActivity);
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Case draft has been created",
                    caseId = _case.CaseId
                });
            }
        }

        [HttpGet("draft")]
        public async Task<ActionResult> GetCaseDraft(string caseId)
        {
            Case? _case = await _context.Case.FindAsync(caseId);

            if (_case == null)
            {
                return BadRequest("Case not found.");
            }

            if (_case.Status != "DRAFT")
            {
                return BadRequest("Case is no longer a draft.");
            }

            return Ok(new GetCaseDraftResponse
            {
                caseId = _case.CaseId,
                title = _case.Title,
                objective = _case.Objective,
                collaboratorUserId = _case.CollaboratorUserId,
                startTime = _case.StartTime,
                endTime = _case.EndTime,
                personNumber = _case.PersonNumber,
                generalAttribute = _case.GeneralAttribute,
                colorAttribute = _case.ColorAttribute,
                tagId = _case.TagId
            });
        }

        // 2. Searching through evidences, updating case status into "ONGOING", and filling up the RelationCaseEvidence table
        [HttpPost("CreateOngoingCase")]
        public async Task<ActionResult> CreateOngoingCase(CreateCaseRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            User? creator = await _context.User.FindAsync(request.creatorUserId);

            if (creator == null)
            {
                return BadRequest("User not found.");
            }

            if (request.caseId == null)
            {
                return BadRequest("Case not found.");
            }

            Case? _case = await _context.Case.FindAsync(request.caseId);

            if (_case == null)
            {
                return BadRequest("Case not found.");
            }

            _case.Title = request.title;
            _case.Objective = request.objective;
            _case.CollaboratorUserId = request.collaboratorUserId;
            _case.StartTime = request.startTime;
            _case.EndTime = request.endTime;
            _case.PersonNumber = request.personNumber;
            _case.GeneralAttribute = request.generalAttribute;
            _case.ColorAttribute = request.colorAttribute;
            _case.TagId = request.tagId;
            _case.Status = "ONGOING";
            _case.CreatedAt = dateTime;
            _case.UpdatedAt = dateTime;

            List<string> evidenceIds = await _context.Evidence.Select(e => e.EvidenceId).ToListAsync();

            foreach (Evidence evidence in await _context.Evidence.Include(e => e.Tags).ToListAsync())
            {
                IDocumentSession session = DocumentStoreHolder.Store.OpenSession();

                VideoFootage? videoFootage = session.Load<VideoFootage>(evidence.EvidenceDocumentId);

                if (videoFootage == null)
                {
                    evidenceIds.Remove(evidence.EvidenceId);

                    continue;
                }

                if (_case.StartTime != null && videoFootage.CreatedAt.ToUnixTimestamp() < _case.StartTime)
                {
                    evidenceIds.Remove(evidence.EvidenceId);
                }

                if (_case.EndTime != null && videoFootage.CreatedAt.ToUnixTimestamp() > _case.EndTime)
                {
                    evidenceIds.Remove(evidence.EvidenceId);
                }

                TimeSeriesEntry<FaceRecognitionDataTimeSeries>[]? faceRecognitionDataTimeSeriesList = session.TimeSeriesFor<FaceRecognitionDataTimeSeries>(videoFootage.VideoFootageId).Get();

                if (faceRecognitionDataTimeSeriesList != null)
                {
                    if (faceRecognitionDataTimeSeriesList.Select(frdtsl => frdtsl.Value.PersonNumber).ToList().Intersect(_case.PersonNumber).Any())
                    {
                        continue;
                    }
                }

                TimeSeriesEntry<PeopleAttributeGeneralDataTimeSeries>[]? peopleAttributeGeneralDataTimeSeriesList = session.TimeSeriesFor<PeopleAttributeGeneralDataTimeSeries>(videoFootage.VideoFootageId).Get();

                if (peopleAttributeGeneralDataTimeSeriesList != null)
                {
                    if (peopleAttributeGeneralDataTimeSeriesList
                        .Select(pagdtsl => pagdtsl.Value)
                        .ToList()
                        .Select(x => x.GetType().GetProperties()
                            .Where(p => !p.Name.Contains("UnixTimestamp") && Convert.ToDouble(p.GetValue(x)) >= attributeThreshold)
                            .Select(p => char.ToLower(p.Name[0]) + p.Name.Substring(1)))
                        .ToList()
                        .SelectMany(x => x)
                        .Distinct()
                        .ToList()
                        .Intersect(_case.GeneralAttribute)
                        .Any())
                    {
                        continue;
                    }
                }

                TimeSeriesEntry<PeopleAttributeColorDataTimeSeries>[]? peopleAttributeColorDataTimeSeriesList = session.TimeSeriesFor<PeopleAttributeColorDataTimeSeries>(videoFootage.VideoFootageId).Get();

                if (peopleAttributeColorDataTimeSeriesList != null)
                {
                    if (peopleAttributeColorDataTimeSeriesList
                        .Select(pacdtsl => pacdtsl.Value)
                        .ToList()
                        .Select(x => x.GetType().GetProperties()
                            .Where(p => Convert.ToDouble(p.GetValue(x)) >= attributeThreshold)
                            .Select(p => char.ToLower(p.Name[0]) + p.Name.Substring(1)))
                        .ToList()
                        .SelectMany(x => x)
                        .Distinct()
                        .ToList()
                        .Intersect(_case.ColorAttribute)
                        .Any())
                    {
                        continue;
                    }
                }

                if (evidence.Tags.Select(et => et.TagId).ToList().Intersect(_case.TagId).Any())
                {
                    continue;
                }

                evidenceIds.Remove(evidence.EvidenceId);
            }
            
            foreach (string evidenceId in evidenceIds)
            {
                RelationCaseEvidence relationCaseEvidence = new RelationCaseEvidence
                {
                    Id = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    CaseId = _case.CaseId,
                    EvidenceId = evidenceId,
                    Status = "LINKED"
                };

                _context.RelationCaseEvidences.Add(relationCaseEvidence);
            }

            Activity? activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "CREATE")
                .FirstOrDefaultAsync();

            if (activity != null)
            {
                CaseActivity caseActivity = new CaseActivity
                {
                    CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    CaseId = _case.CaseId,
                    ActivityId = activity.ActivityId,
                    RelatedId = null,
                    RelatedData = null,
                    UserId = _case.CreatorUserId,
                    CreatedAt = _case.CreatedAt
                };

                _context.CaseActivity.Add(caseActivity);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Case has been created",
                caseId = _case.CaseId
            });
        }

        //3. Fetching list of evidences from RelationCaseEvidence table
        [HttpGet("GetCase")]
        public async Task<ActionResult> GetCaseData(string caseId)
        {
            Case? _case = await _context.Case
                .Where(c => c.CaseId == caseId)
                .Include(c => c.Tags)
                .FirstOrDefaultAsync();

            if (_case == null)
            {
                return NotFound("Case not found.");
            }

            List<string> collaborators = new List<string>();

            if (_case.CollaboratorUserId != null)
            {
                foreach (string collaboratorUserId in _case.CollaboratorUserId)
                {
                    collaborators.Add(await _context.User.Where(u => u.UserId == collaboratorUserId).Select(u => $"{u.FirstName} {u.LastName}").FirstOrDefaultAsync());
                }
            }

            List<object> personBaseFilter = new List<object>();

            if (_case.PersonNumber != null)
            {
                foreach (double personNumber in _case.PersonNumber)
                {
                    Person? person = await _context.Person.Where(p => p.PersonNumber == personNumber).FirstOrDefaultAsync();

                    if (person == null)
                    {
                        continue;
                    }

                    personBaseFilter.Add(new
                    {
                        name = person.Name,
                        picture = person.ProfilePictureUrl != null ? Convert.ToBase64String(System.IO.File.ReadAllBytes(person.ProfilePictureUrl)) : null
                    });
                }
            }

            TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;

            AttributeBaseFilter attributeBaseFilter = new AttributeBaseFilter
            {
                age = _case.GeneralAttribute.Any(ga => ga == "young" || ga == "adult") ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga == "young" || ga == "adult"))) : null,
                gender = _case.GeneralAttribute.Any(ga => ga == "male" || ga == "female") ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga == "male" || ga == "female"))) : null,
                hairLength = _case.GeneralAttribute.Any(ga => ga.Contains("hair")) ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga.Contains("hair")).Select(ga => ga.Replace("hair", "")))) : null,
                upperClothesLength = _case.GeneralAttribute.Any(ga => ga.Contains("upper")) ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga.Contains("upper")).Select(ga => ga.Replace("upper", "")))) : null,
                upperClothesColor = _case.ColorAttribute.Any(ca => ca.Contains("upperColor")) ? textInfo.ToTitleCase(string.Join(", ", _case.ColorAttribute.Where(ca => ca.Contains("upperColor")).Select(ca => ca.Replace("upperColor", "")))) : null,
                lowerClothesLength = _case.GeneralAttribute.Any(ga => ga.Contains("lower")) ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga.Contains("lower")).Select(ga => ga.Replace("lower", "")))) : null,
                lowerClothesType = _case.GeneralAttribute.Any(ga => ga == "pants" || ga == "skirt") ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga == "pants" || ga == "skirt"))) : null,
                lowerClothesColor = _case.ColorAttribute.Any(ca => ca.Contains("lowerColor")) ? textInfo.ToTitleCase(string.Join(", ", _case.ColorAttribute.Where(ca => ca.Contains("lowerColor")).Select(ca => ca.Replace("lowerColor", "")))) : null,
                accessories = _case.GeneralAttribute.Any(ga => ga == "bag" || ga == "hat" || ga == "helmet" || ga == "backBag") ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga == "bag" || ga == "hat" || ga == "helmet" || ga == "backBag").Select(ga => ga == "backBag" ? ga.Replace("backBag", "back bag") : ga))) : null
            };

            List<object> tags = new List<object>();

            foreach (Tag tag in _case.Tags)
            {
                tags.Add(new
                {
                    tagId = tag.TagId,
                    tagName = tag.Name
                });
            }

            List<object> evidences = new List<object>();

            List<RelationCaseEvidence> relationCaseEvidences =  await _context.RelationCaseEvidences.Where(x => x.CaseId == caseId).ToListAsync();
            
            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                foreach (RelationCaseEvidence relationCaseEvidence in relationCaseEvidences)
                {
                    if (relationCaseEvidence.Status == "NEW")
                    {
                        continue;
                    }

                    Evidence? evidence = await _context.Evidence
                        .Where(e => e.EvidenceId == relationCaseEvidence.EvidenceId)
                        .Include(e => e.Tags)
                        .FirstOrDefaultAsync();

                    if (evidence == null)
                    {
                        continue;
                    }

                    VideoFootage? videoFootage = session.Query<VideoFootage>().Where(x => x.EvidenceId == relationCaseEvidence.EvidenceId).FirstOrDefault();

                    List<object> evidenceTags = new List<object>();

                    foreach (Tag tag in evidence.Tags)
                    {
                        evidenceTags.Add(new
                        {
                            tagId = tag.TagId,
                            tagName = tag.Name
                        });
                    }

                    evidences.Add(new
                    {
                        evidenceId = relationCaseEvidence.EvidenceId,
                        evidenceName = videoFootage.Name,
                        status = relationCaseEvidence.Status,
                        tags = evidenceTags
                    });
                }
            }

            return Ok(new
            {
                caseId = _case.CaseId,
                creator = await _context.User.Where(u => u.UserId == _case.CreatorUserId).Select(u => $"{u.FirstName} {u.LastName}").FirstOrDefaultAsync(),
                collaborators = collaborators,
                title = _case.Title,
                objective = _case.Objective,
                executiveSummary = _case.ExecutiveSummary,
                conclusion = _case.Conclusion,
                personBaseFilter = personBaseFilter,
                attributeBaseFilter = attributeBaseFilter,
                status = _case.Status,
                createdAt = _case.CreatedAt,
                updatedAt = _case.UpdatedAt,
                tags = tags,
                evidences = evidences
            });
        }

        //4. Ending the case investigation
        [HttpPut("CloseCase")]
        public async Task<ActionResult>CloseCase(CloseCaseDTO request)
        {
            DateTime dateTime = DateTime.UtcNow;

            Case? _case = _context.Case.Find(request.caseId);

            if (_case == null)
            {
                return BadRequest("Case not found.");
            }

            _case.Status = "CLOSED";
            _case.UpdatedAt = dateTime;

            Activity? activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "CLOSE")
                .FirstOrDefaultAsync();

            if (activity != null)
            {
                CaseActivity caseActivity = new CaseActivity
                {
                    CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    CaseId = _case.CaseId,
                    ActivityId = activity.ActivityId,
                    RelatedId = null,
                    RelatedData = request.reason,
                    UserId = request.creatorUserId, // TAMBAHIN USERID DI REQUEST
                    CreatedAt = dateTime
                };

                _context.CaseActivity.Add(caseActivity);
            }

            _context.SaveChanges();

            return Ok("Case Investigation Has Been Closed");
        }

        //5. Deleting case from FE, but still keeping records of the case 
        [HttpPut("SoftDeleteCase")]
        public async Task<ActionResult>SoftDeleteCase(CloseCaseDTO request)
        {
            DateTime dateTime = DateTime.UtcNow;

            Case? _case = _context.Case.Find(request.caseId);

            if (_case == null)
            {
                return BadRequest("Case not found.");
            }

            _case.Status = "DELETED";
            _case.UpdatedAt = dateTime;

            Activity? activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "DELETE")
                .FirstOrDefaultAsync();

            if (activity != null)
            {
                CaseActivity caseActivity = new CaseActivity
                {
                    CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    CaseId = _case.CaseId,
                    ActivityId = activity.ActivityId,
                    RelatedId = null,
                    RelatedData = null,
                    UserId = request.creatorUserId, // TAMBAHIN USERID DI REQUEST
                    CreatedAt = dateTime
                };

                _context.CaseActivity.Add(caseActivity);
            }

            _context.SaveChanges();

            return Ok("Case has been deleted");
        }

        //API for updating case and evidence relation status ("NEW","LINKED","UNLINKED")
        [HttpPut("UpdateCaseEvidenceRelationStatus")]
        public async Task<ActionResult>UpdateCaseData(UpdateRelationDTO request)
        {
            DateTime dateTime = DateTime.UtcNow;

            RelationCaseEvidence? SelectedCaseEvidenceRelation = await _context.RelationCaseEvidences
                .Where(x => x.CaseId == request.caseId && x.EvidenceId == request.evidenceId)
                .FirstOrDefaultAsync();

            if (SelectedCaseEvidenceRelation == null)
            {
                return BadRequest("No Relation Detected");
            }

            SelectedCaseEvidenceRelation.Status = request.status;

            Activity? activity = null;

            if (request.status == "LINKED")
            {
                activity = await _context.Activity
                    .Where(a => a.Type == "CASE" && a.Action == "LINK EVIDENCE")
                    .FirstOrDefaultAsync();
            }
            else if (request.status == "UNLINKED")
            {
                activity = await _context.Activity
                    .Where(a => a.Type == "CASE" && a.Action == "UNLINK EVIDENCE")
                    .FirstOrDefaultAsync();
            }

            if (activity != null)
            {
                CaseActivity caseActivity = new CaseActivity
                {
                    CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    CaseId = SelectedCaseEvidenceRelation.CaseId,
                    ActivityId = activity.ActivityId,
                    RelatedId = SelectedCaseEvidenceRelation.EvidenceId,
                    RelatedData = null,
                    UserId = request.userId, // TAMBAHIN USERID DI REQUEST
                    CreatedAt = dateTime
                };

                _context.CaseActivity.Add(caseActivity);
            }

            _context.SaveChanges();

            return Ok();
        }

        // API for RelationCaseEvidence Note
        // 1. Adding Analytics Note
        [HttpPost("AddRelationCaseEvidenceNote")]
        public async Task<ActionResult>AddRelationCaseEvidenceNote(PostRelationNotesDTO request)
        {
            Evidence? evidence = await _context.Evidence.FindAsync(request.evidenceId);

            if (evidence == null)
            {
                return NotFound("Evidence not found.");
            }

            VideoFootage videoFootage = new VideoFootage();

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                videoFootage = session.Load<VideoFootage>(evidence.EvidenceDocumentId);

                if (videoFootage == null)
                {
                    return NotFound("Video footage not found.");
                }
            }

            RelationCaseEvidenceAnalytic NewNotes = new RelationCaseEvidenceAnalytic()
            {
                Id = string.Join("", Guid.NewGuid().ToString().ToArray()),
                CreatorUserId = request.creatorUserId,
                RelationCaseEvidenceId = await _context.RelationCaseEvidences.Where(x => x.CaseId == request.caseId && x.EvidenceId == request.evidenceId).Select(x => x.Id).FirstOrDefaultAsync(),
                StartTime = videoFootage.StartedAt.Value.AddSeconds(request.startTime / videoFootage.AnalysisSpeedRatio),
                EndTime = videoFootage.StartedAt.Value.AddSeconds(request.endTime / videoFootage.AnalysisSpeedRatio),
                Notes = request.notes,
                Level = request.level,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            _context.RelationCaseEvidenceAnalytics.Add(NewNotes);

            RelationCaseEvidence? relationCaseEvidence = await _context.RelationCaseEvidences.FindAsync(NewNotes.RelationCaseEvidenceId);

            Activity? activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "ADD NOTES")
                .FirstOrDefaultAsync();

            if (relationCaseEvidence != null && activity != null)
            {
                CaseActivity caseActivity = new CaseActivity
                {
                    CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    CaseId = relationCaseEvidence.CaseId,
                    ActivityId = activity.ActivityId,
                    RelatedId = NewNotes.Id,
                    RelatedData = null,
                    UserId = NewNotes.CreatorUserId,
                    CreatedAt = (DateTime)NewNotes.CreatedAt
                };

                _context.CaseActivity.Add(caseActivity);
            }

            _context.SaveChanges();
            var response = _context.RelationCaseEvidenceAnalytics
                           .OrderByDescending(x => x.CreatedAt)
                           .Where(x => x.CreatorUserId == request.creatorUserId)
                           .First();
            return Ok(new
            {
                startTime = response.StartTime, 
                endTime = response.EndTime,
                notes = response.Notes,
                level = response.Level,
            });
        }

        //2. Fetching All notes when refreshes page
        [HttpGet("GetRelationCaseEvidenceNote")]
        public async Task<ActionResult> GetRelationEvidenceNote(string caseId, string evidenceId)
        {
            Evidence? evidence = await _context.Evidence.FindAsync(evidenceId);

            if (evidence == null)
            {
                return NotFound("Evidence not found.");
            }

            VideoFootage videoFootage = new VideoFootage();

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                videoFootage = session.Load<VideoFootage>(evidence.EvidenceDocumentId);

                if (videoFootage == null)
                {
                    return NotFound("Video footage not found.");
                }
            }

            string? relationCaseEvidenceId = await _context.RelationCaseEvidences.Where(x => x.CaseId == caseId && x.EvidenceId == evidenceId).Select(x => x.Id).FirstOrDefaultAsync();
            var notes = _context.RelationCaseEvidenceAnalytics.Where(x=>x.RelationCaseEvidenceId == relationCaseEvidenceId).ToList();
            List<object> ListOfNotes = new List<object>();
            var x = 0;
            foreach (var note in notes)
            {
                x = x + 1;
                var TimeFrameNote = new
                {
                    id = x,
                    title = "Note" + " " + x,
                    notes = note.Notes,
                    level = note.Level,
                    startTime = (note.StartTime.Value.ToUnixTimestamp() - videoFootage.StartedAt.Value.ToUnixTimestamp()) * videoFootage.AnalysisSpeedRatio,
                    endTime = (note.EndTime.Value.ToUnixTimestamp() - videoFootage.StartedAt.Value.ToUnixTimestamp()) * videoFootage.AnalysisSpeedRatio
                };
                ListOfNotes.Add(TimeFrameNote);
            }
            return Ok(ListOfNotes);
        }

        //3. Get CaseEvidenceRelationNotesId
        [HttpGet("GetRelationCaseEvidenceNoteById")]
        public async Task<ActionResult> GetRelationCaseEvidenceNoteById()
        {
            var notes = _context.RelationCaseEvidenceAnalytics.ToList();
            return Ok(notes);
        }

        //API for adding tags to case
        //1. Add case tag
        [HttpPost("tag/add")]
        public async Task<ActionResult> AddCaseTag(AddCaseTagRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            Case? _case = await _context.Case
                .Where(c => c.CaseId == request.caseId)
                .Include(c => c.Tags)
                .FirstOrDefaultAsync();

            if (_case == null)
            {
                return BadRequest("Case not found.");
            }

            Tag? tag = await _context.Tag.Where(t => t.Name == request.tagName).FirstOrDefaultAsync();

            if (tag == null)
            {
                AddTagRequest addTagRequest = new AddTagRequest
                {
                    creatorUserId = request.creatorUserId,
                    name = request.tagName
                };

                ActionResult<Tag> tagActionResult = await _tagController.AddTag(addTagRequest);

                if (tagActionResult == null)
                {
                    return BadRequest("Tag not found.");
                }

                tag = tagActionResult.Value;
            }

            _case.Tags.Add(tag);

            Activity? activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "ADD TAG")
                .FirstOrDefaultAsync();

            if (activity != null)
            {
                CaseActivity caseActivity = new CaseActivity
                {
                    CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    CaseId = _case.CaseId,
                    ActivityId = activity.ActivityId,
                    RelatedId = tag.TagId,
                    RelatedData = null,
                    UserId = request.creatorUserId,
                    CreatedAt = dateTime
                };

                _context.CaseActivity.Add(caseActivity);
            }

            await _context.SaveChangesAsync();

            return Ok(tag.TagId);
        }

        //2. Get case tag list
        [HttpGet("tag/list")]
        public async Task<ActionResult> GetCaseTagList(string caseId)
        {
            return Ok(await _context.Case
                .Where(c => c.CaseId == caseId)
                .Include(c => c.Tags)
                .Select(c => c.Tags)
                .FirstOrDefaultAsync());
        }

        //3. Delete case tag
        [HttpDelete("tag/delete")]
        public async Task<ActionResult> DeleteCaseTag(DeleteCaseTagRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            Case? _case = await _context.Case
                .Where(c => c.CaseId == request.caseId)
                .Include(c => c.Tags)
                .FirstOrDefaultAsync();

            if (_case == null)
            {
                return BadRequest("Case not found.");
            }
            
            Tag? tag = await _context.Tag.FindAsync(request.tagId);

            if (tag == null)
            {
                return BadRequest("Tag not found.");
            }

            _case.Tags.Remove(tag);

            Activity? activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "DELETE TAG")
                .FirstOrDefaultAsync();

            if (activity != null)
            {
                CaseActivity caseActivity = new CaseActivity
                {
                    CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    CaseId = _case.CaseId,
                    ActivityId = activity.ActivityId,
                    RelatedId = tag.TagId,
                    RelatedData = null,
                    UserId = request.creatorUserId,
                    CreatedAt = dateTime
                };

                _context.CaseActivity.Add(caseActivity);
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("activity/list")]
        public async Task<ActionResult> GetCaseActivityList(string caseId)
        {
            List<Object> response = new List<Object>();

            if (await _context.Case.FindAsync(caseId) == null)
            {
                return NotFound("Case not found.");
            }

            var caseActivities = await _context.Case
                .Where(c => c.CaseId == caseId)
                .Include(c => c.CaseActivities)
                .Select(c => c.CaseActivities)
                .FirstOrDefaultAsync();

            foreach (CaseActivity caseActivity in caseActivities.OrderByDescending(ca => ca.CreatedAt))
            {
                Activity? activity = await _context.Activity.FindAsync(caseActivity.ActivityId);
                User? user = await _context.User.FindAsync(caseActivity.UserId);

                response.Add(new
                {
                    activity = activity.Description,
                    user = $"{user.FirstName} {user.LastName}",
                    createdAt = caseActivity.CreatedAt
                });
            }

            return Ok(response);
        }

        // API for updating case filter
        [HttpPost("UpdateFilter")]
        public async Task<ActionResult> UpdateCaseFilter(UpdateCaseFilterDTO request)
        {
            List<object>newEvidence = new List<object>();
            List<RelationCaseEvidence> newRelation = new List<RelationCaseEvidence>();
            List<object> relationEvidenceId = new List<object>();
            List<object> evidences = new List<object>();
            var tags = _context.Tag.ToList();
            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                var videoFootage = session.Query<VideoFootage>().ToList();
                foreach (var footage in videoFootage)
                {
                    var faceRecognitionData = session.TimeSeriesFor<FaceRecognitionDataTimeSeries>(footage.VideoFootageId).Get();
                    var colorTimeSeriesData = session.TimeSeriesFor<PeopleAttributeColorDataTimeSeries>(footage.VideoFootageId).Get();
                    var generalAttTimeSeriesData = session.TimeSeriesFor<PeopleAttributeGeneralDataTimeSeries>(footage.VideoFootageId).Get();
                    var personNumber = faceRecognitionData.Select(x => x.Value.PersonNumber).ToList();
                    foreach (var number in request.personNumber)
                    {
                        foreach (var person in personNumber)
                        {
                            if (person == (double)number)
                            {
                                evidences.Add(footage.VideoFootageId);
                            }
                        }
                    }
                    foreach (var color in request.colorAtt)
                    {
                        foreach (var colorAtt in colorTimeSeriesData)
                        {
                            string modifiedColor = char.ToUpper(color[0]) + color.Substring(1);
                            PropertyInfo property = colorAtt.Value.GetType().GetProperty(modifiedColor);
                            if (property != null)
                            {
                                var propertyValue = property.GetValue(colorAtt.Value);
                                Console.WriteLine(propertyValue);
                                if ((double)propertyValue > 0)
                                {
                                    evidences.Add(footage.VideoFootageId);
                                }
                            }
                        }
                    }
                    foreach (var generalAtt in request.generalAtt)
                    {
                        foreach (var peopleAtt in generalAttTimeSeriesData)
                        {
                            string modifiedGeneral = char.ToUpper(generalAtt[0]) + generalAtt.Substring(1);
                            PropertyInfo property = peopleAtt.Value.GetType().GetProperty(modifiedGeneral);
                            if (property != null)
                            {
                                var propertyValue = property.GetValue(peopleAtt.Value);
                                if ((double)propertyValue > 0)
                                {
                                    evidences.Add(footage.VideoFootageId);
                                }
                            }
                        }
                    }
                }
            }

            if (tags.Count > 0)
            {
                foreach (var tag in tags)
                {
                    var evidenceswWithTags = tag.Evidences.ToList();
                    foreach (var evidence in evidenceswWithTags)
                    {
                        evidences.Add(evidence.EvidenceDocumentId);
                    }
                }
            }

            var deleteDuplicateEvidence = evidences.Distinct().ToList();
            if (deleteDuplicateEvidence.Count > 0)
            {
                foreach (var footage in deleteDuplicateEvidence)
                {
                    var evidence = _context.Evidence.Where(x => x.EvidenceDocumentId == footage).FirstOrDefault();
                    relationEvidenceId.Add(evidence.EvidenceId);
                }

                var currentCaseDraft = _context.Case.Find(request.caseId);

                if (currentCaseDraft == null)
                {
                    return NotFound("There is no such case");
                }

                currentCaseDraft.UpdatedAt = DateTime.UtcNow;
                _context.SaveChanges();

                foreach (var evidenceId in relationEvidenceId)
                {
                    RelationCaseEvidence NewRelation = new RelationCaseEvidence()
                    {
                        Id = string.Join("", Guid.NewGuid().ToString().ToArray()),
                        CaseId = request.caseId,
                        EvidenceId = (string)evidenceId,
                        Status = "LINKED"
                    };
                    newRelation.Add(NewRelation);
                }
                foreach (var newRelations in newRelation)
                {
                    _context.RelationCaseEvidences.Add(newRelations);
                    _context.SaveChanges();
                }

                var response = new { Message = "Case Has Been Updated" };
                return Ok(response);
            }
            return NotFound("Case Not Found");
        }

        // API for adding new evidence
        [HttpPost("AddNewEvidence")]
        public async Task<ActionResult> AddNewEvidence(UpdateCaseFilterDTO request)
        {
            List<object> relationEvidenceId = new List<object>();
            List<object> evidences = new List<object>();
            var tags = _context.Tag.ToList();
            foreach (var evidenceId in request.evidenceIds)
            {
                using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
                {
                    var videoFootage = session.Query<VideoFootage>().Where(x=> x.EvidenceId == evidenceId).FirstOrDefault();

                        var faceRecognitionData = session.TimeSeriesFor<FaceRecognitionDataTimeSeries>(videoFootage.VideoFootageId).Get();
                        var colorTimeSeriesData = session.TimeSeriesFor<PeopleAttributeColorDataTimeSeries>(videoFootage.VideoFootageId).Get();
                        var generalAttTimeSeriesData = session.TimeSeriesFor<PeopleAttributeGeneralDataTimeSeries>(videoFootage.VideoFootageId).Get();
                        var personNumber = faceRecognitionData.Select(x => x.Value.PersonNumber).ToList();
                        foreach (var number in request.personNumber)
                        {
                            foreach (var person in personNumber)
                            {
                                if (person == (double)number)
                                {
                                    evidences.Add(videoFootage.VideoFootageId);
                                }
                            }
                        }
                        foreach (var color in request.colorAtt)
                        {
                            foreach (var colorAtt in colorTimeSeriesData)
                            {
                                string modifiedColor = char.ToUpper(color[0]) + color.Substring(1);
                                PropertyInfo property = colorAtt.Value.GetType().GetProperty(modifiedColor);
                                if (property != null)
                                {
                                    var propertyValue = property.GetValue(colorAtt.Value);
                                    Console.WriteLine(propertyValue);
                                    if ((double)propertyValue > 0)
                                    {
                                        evidences.Add(videoFootage.VideoFootageId);
                                    }
                                }
                            }
                        }
                        foreach (var generalAtt in request.generalAtt)
                        {
                            foreach (var peopleAtt in generalAttTimeSeriesData)
                            {
                                string modifiedGeneral = char.ToUpper(generalAtt[0]) + generalAtt.Substring(1);
                                PropertyInfo property = peopleAtt.Value.GetType().GetProperty(modifiedGeneral);
                                if (property != null)
                                {
                                    var propertyValue = property.GetValue(peopleAtt.Value);
                                    if ((double)propertyValue > 0)
                                    {
                                        evidences.Add(videoFootage.VideoFootageId);
                                    }
                                }
                            }
                        }
                }

                if (tags.Count > 0)
                {
                    foreach (var tag in tags)
                    {
                        var evidenceswWithTags = tag.Evidences.ToList();
                        foreach (var evidence in evidenceswWithTags)
                        {
                            evidences.Add(evidence.EvidenceDocumentId);
                        }
                    }
                }
            }
           
            var deleteDuplicateEvidence = evidences.Distinct().ToList();
            if (deleteDuplicateEvidence.Count > 0)
            {
                foreach (var footage in deleteDuplicateEvidence)
                {
                    var evidence = _context.Evidence.Where(x => x.EvidenceDocumentId == footage).FirstOrDefault();
                    relationEvidenceId.Add(evidence.EvidenceId);
                }

                var OngoingCase = _context.Case.Find(request.caseId);

                if (OngoingCase == null)
                {
                    return NotFound("There is no such case");
                }

                OngoingCase.UpdatedAt = DateTime.UtcNow;
                _context.SaveChanges();

                foreach (var evidenceId in relationEvidenceId)
                {
                    var relationStatus = _context.RelationCaseEvidences.Where(x => x.EvidenceId == evidenceId).Select(x=> x.Status).FirstOrDefault();
                    relationStatus = "LINKED";
                }
                _context.SaveChanges();

                var response = new { Message = "New Evidence Has Been Added" };
                return Ok(response);
            }
            return NotFound("Case Not Found");
        }

        [HttpGet("list")]
        public async Task<ActionResult> GetCaseList(string userId)
        {
            List<object> getCaseListResponse = new List<object>();

            List<Case> _cases = await _context.Case.OrderByDescending(c => c.UpdatedAt).ToListAsync();

            foreach (Case _case in _cases)
            {
                if (_case.Status == "DELETED")
                {
                    continue;
                }

                if (_case.CreatorUserId == userId || (_case.CollaboratorUserId != null && _case.CollaboratorUserId.Contains(userId)))
                {
                    List<string> collaboratorUserName = new List<string>();

                    if (_case.CollaboratorUserId != null)
                    {
                        foreach (string collaboratorUserId in _case.CollaboratorUserId)
                        {
                            collaboratorUserName.Add(await _context.User.Where(u => u.UserId == collaboratorUserId).Select(u => $"{u.FirstName} {u.LastName}").FirstOrDefaultAsync());
                        }
                    }
                    
                    getCaseListResponse.Add(new
                    {
                        caseId = _case.CaseId,
                        title = _case.Title,
                        objective = _case.Objective,
                        creatorUserName = await _context.User.Where(u => u.UserId == _case.CreatorUserId).Select(u => $"{u.FirstName} {u.LastName}").FirstOrDefaultAsync(),
                        collaboratorUserName = collaboratorUserName,
                        status = _case.Status,
                        createdAt = _case.CreatedAt,
                        updatedAt = _case.UpdatedAt
                    });
                }
            }
            
            return Ok(getCaseListResponse);
        }

        [HttpGet("report")]
        public async Task<ActionResult> GetCaseReport(string caseId)
        {
            Case? _case = await _context.Case
                .Where(c => c.CaseId == caseId)
                .Include(c => c.Tags)
                .FirstOrDefaultAsync();
            
            if (_case == null)
            {
                return NotFound("Case not found.");
            }

            Activity? activity = new Activity();
            DateTime? dateOpened = null;

            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "CREATE")
                .FirstOrDefaultAsync();

            if (activity != null)
            {
                dateOpened = await _context.CaseActivity
                    .Where(ca => ca.CaseId == caseId && ca.ActivityId == activity.ActivityId)
                    .OrderBy(ca => ca.CreatedAt)
                    .Select(ca => ca.CreatedAt)
                    .FirstOrDefaultAsync();
            }

            List<string> collaborators = new List<string>();

            if (_case.CollaboratorUserId != null)
            {
                foreach (string collaboratorUserId in _case.CollaboratorUserId)
                {
                    collaborators.Add(await _context.User.Where(u => u.UserId == collaboratorUserId).Select(u => $"{u.FirstName} {u.LastName}").FirstOrDefaultAsync());
                }
            }

            DateTime? dateClosed = null;

            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "CLOSE")
                .FirstOrDefaultAsync();

            if (_case.Status == "CLOSED" && activity != null)
            {
                dateClosed = await _context.CaseActivity
                    .Where(ca => ca.CaseId == caseId && ca.ActivityId == activity.ActivityId)
                    .OrderBy(ca => ca.CreatedAt)
                    .Select(ca => ca.CreatedAt)
                    .FirstOrDefaultAsync();
            }

            string? durationOfInvestigation = null;

            if (_case.Status == "CLOSED" && dateOpened != null && dateClosed != null)
            {
                TimeSpan duration = (DateTime)dateClosed - (DateTime)dateOpened;

                int days = duration.Days;
                int hours = duration.Hours;
                int minutes = duration.Minutes;
                int seconds = duration.Seconds;

                if (seconds > 0)
                {
                    minutes++;
                }

                if (minutes == 60)
                {
                    hours++;
                    minutes = 0;
                }

                if (hours == 24)
                {
                    days++;
                    hours = 0;
                }

                durationOfInvestigation = $"{days} d {hours} h {minutes} m";
            }

            List<string> tags = new List<string>();

            foreach (Tag tag in _case.Tags.OrderBy(ct => ct.Name))
            {
                tags.Add(tag.Name);
            }

            List<TeamMember> teamMember = new List<TeamMember>();

            User? creator = await _context.User.FindAsync(_case.CreatorUserId);

            if (creator != null)
            {
                teamMember.Add(new TeamMember
                {
                    name = $"{creator.FirstName} {creator.LastName}",
                    picture = creator.ProfilePictureUrl != null ? Convert.ToBase64String(System.IO.File.ReadAllBytes(creator.ProfilePictureUrl)) : null,
                    email = creator.Email,
                    role = "Creator",
                    dateJoined = dateOpened
                });
            }

            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "ADD COLLABORATOR")
                .FirstOrDefaultAsync();

            if (_case.CollaboratorUserId != null)
            {
                foreach (string collaboratorUserId in _case.CollaboratorUserId)
                {
                    User? collaborator = await _context.User.FindAsync(collaboratorUserId);

                    if (collaborator != null)
                    {
                        DateTime? dateJoined = null;

                        if (activity != null)
                        {
                            CaseActivity? caseActivity = await _context.CaseActivity
                                .Where(ca => ca.CaseId == caseId && ca.ActivityId == activity.ActivityId && ca.RelatedId == collaboratorUserId)
                                .OrderBy(ca => ca.CreatedAt)
                                .FirstOrDefaultAsync();

                            if (caseActivity != null)
                            {
                                dateJoined = caseActivity.CreatedAt;
                            }
                        }

                        teamMember.Add(new TeamMember
                        {
                            name = $"{collaborator.FirstName} {collaborator.LastName}",
                            picture = collaborator.ProfilePictureUrl != null ? Convert.ToBase64String(System.IO.File.ReadAllBytes(collaborator.ProfilePictureUrl)) : null,
                            email = collaborator.Email,
                            role = "Collaborator",
                            dateJoined = dateJoined != null ? dateJoined : dateOpened
                        });
                    }
                }
            }

            List<object> personBaseFilter = new List<object>();

            if (_case.PersonNumber != null)
            {
                foreach (double personNumber in _case.PersonNumber)
                {
                    Person? person = await _context.Person.Where(p => p.PersonNumber == personNumber).FirstOrDefaultAsync();

                    if (person == null)
                    {
                        continue;
                    }

                    personBaseFilter.Add(new
                    {
                        name = person.Name,
                        picture = person.ProfilePictureUrl != null ? Convert.ToBase64String(System.IO.File.ReadAllBytes(person.ProfilePictureUrl)) : null
                    });
                }
            }

            TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;

            AttributeBaseFilter attributeBaseFilter = new AttributeBaseFilter
            {
                age = _case.GeneralAttribute.Any(ga => ga == "young" || ga == "adult") ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga == "young" || ga == "adult"))) : null,
                gender = _case.GeneralAttribute.Any(ga => ga == "male" || ga == "female") ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga == "male" || ga == "female"))) : null,
                hairLength = _case.GeneralAttribute.Any(ga => ga.Contains("hair")) ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga.Contains("hair")).Select(ga => ga.Replace("hair", "")))) : null,
                upperClothesLength = _case.GeneralAttribute.Any(ga => ga.Contains("upper")) ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga.Contains("upper")).Select(ga => ga.Replace("upper", "")))) : null,
                upperClothesColor = _case.ColorAttribute.Any(ca => ca.Contains("upperColor")) ? textInfo.ToTitleCase(string.Join(", ", _case.ColorAttribute.Where(ca => ca.Contains("upperColor")).Select(ca => ca.Replace("upperColor", "")))) : null,
                lowerClothesLength = _case.GeneralAttribute.Any(ga => ga.Contains("lower")) ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga.Contains("lower")).Select(ga => ga.Replace("lower", "")))) : null,
                lowerClothesType = _case.GeneralAttribute.Any(ga => ga == "pants" || ga == "skirt") ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga == "pants" || ga == "skirt"))) : null,
                lowerClothesColor = _case.ColorAttribute.Any(ca => ca.Contains("lowerColor")) ? textInfo.ToTitleCase(string.Join(", ", _case.ColorAttribute.Where(ca => ca.Contains("lowerColor")).Select(ca => ca.Replace("lowerColor", "")))) : null,
                accessories = _case.GeneralAttribute.Any(ga => ga == "bag" || ga == "hat" || ga == "helmet" || ga == "backBag") ? textInfo.ToTitleCase(string.Join(", ", _case.GeneralAttribute.Where(ga => ga == "bag" || ga == "hat" || ga == "helmet" || ga == "backBag").Select(ga => ga == "backBag" ? ga.Replace("backBag", "back bag") : ga))) : null
            };

            List<RelationCaseEvidence> relationCaseEvidences = await _context.RelationCaseEvidences.Where(x => x.CaseId == caseId && x.Status == "LINKED").Include(x => x.Evidence.EvidenceSource).Include(x => x.Evidence.Tags).ToListAsync();

            List<object> evidences = new List<object>();

            foreach (RelationCaseEvidence relationCaseEvidence in relationCaseEvidences)
            {
                IDocumentSession session = DocumentStoreHolder.Store.OpenSession();

                VideoFootage videoFootage = session.Load<VideoFootage>(relationCaseEvidence.Evidence.EvidenceDocumentId);

                if (videoFootage == null)
                {
                    return NotFound("Video footage not found.");
                }

                DateTime? dateUploaded = null;

                activity = await _context.Activity
                    .Where(a => a.Type == "EVIDENCE" && a.Action == "ADD VIDEO")
                    .FirstOrDefaultAsync();

                if (activity != null)
                {
                    dateUploaded = await _context.EvidenceActivity
                        .Where(ea => ea.EvidenceId == relationCaseEvidence.EvidenceId && ea.ActivityId == activity.ActivityId)
                        .OrderBy(ea => ea.CreatedAt)
                        .Select(ea => ea.CreatedAt)
                        .FirstOrDefaultAsync();
                }

                List<double> detectedPersonList = new List<double>();

                TimeSeriesEntry<FaceRecognitionDataTimeSeries>[] faceRecognitionDataTimeSeriesList = session.TimeSeriesFor<FaceRecognitionDataTimeSeries>(videoFootage.VideoFootageId).Get();

                foreach (TimeSeriesEntry<FaceRecognitionDataTimeSeries> faceRecognitionDataTimeSeries in faceRecognitionDataTimeSeriesList)
                {
                    detectedPersonList.Add(faceRecognitionDataTimeSeries.Value.PersonNumber);
                }

                List<object> detectedAttributeList = new List<object>();

                TimeSeriesEntry<PeopleAttributeGeneralDataTimeSeries>[] peopleAttributeGeneralDataTimeSeriesList = session.TimeSeriesFor<PeopleAttributeGeneralDataTimeSeries>(videoFootage.VideoFootageId).Get();

                foreach (TimeSeriesEntry<PeopleAttributeGeneralDataTimeSeries> peopleAttributeGeneralDataTimeSeries in peopleAttributeGeneralDataTimeSeriesList)
                {
                    foreach (string detectedAttribute in peopleAttributeGeneralDataTimeSeries.Value.GetType().GetProperties()
                        .Where(p => p.Name != "UnixTimestampStart" && p.Name != "UnixTimestampEnd" && p.Name != "PersonNumber" && Convert.ToDecimal(p.GetValue(peopleAttributeGeneralDataTimeSeries.Value)) > 0)
                        .Select(p => p.Name)
                        .ToList())
                    {
                        detectedAttributeList.Add(detectedAttribute);
                    }
                }

                TimeSeriesEntry<PeopleAttributeColorDataTimeSeries>[] peopleAttributeColorDataTimeSeriesList = session.TimeSeriesFor<PeopleAttributeColorDataTimeSeries>(videoFootage.VideoFootageId).Get();

                foreach (TimeSeriesEntry<PeopleAttributeColorDataTimeSeries> peopleAttributeColorDataTimeSeries in peopleAttributeColorDataTimeSeriesList)
                {
                    foreach (string detectedAttribute in peopleAttributeColorDataTimeSeries.Value.GetType().GetProperties()
                        .Where(p => Convert.ToDecimal(p.GetValue(peopleAttributeColorDataTimeSeries.Value)) > 0)
                        .Select(p => p.Name)
                        .ToList())
                    {
                        detectedAttributeList.Add(detectedAttribute);
                    }
                }

                Dictionary<int, int> personDetectionRate = faceRecognitionDataTimeSeriesList
                    .ToList()
                    .Select(frdtsl =>
                    {
                        DateTime timestamp = DateTimeOffset.FromUnixTimeMilliseconds((long)frdtsl.Value.UnixTimestamp).DateTime;
                        TimeSpan duration = timestamp - (DateTime)videoFootage.StartedAt;
                        return (int)duration.TotalSeconds;
                    })
                    .GroupBy(d => d)
                    .ToDictionary(d => d.Key, d => d.Count());

                Dictionary<int, int> attributeDetectionRate = peopleAttributeGeneralDataTimeSeriesList
                    .ToList()
                    .Select(pagdtsl =>
                    {
                        DateTime timestamp = DateTimeOffset.FromUnixTimeMilliseconds((long)pagdtsl.Value.UnixTimestampStart).DateTime;
                        TimeSpan duration = timestamp - (DateTime)videoFootage.StartedAt;
                        return (int)duration.TotalSeconds;
                    })
                    .GroupBy(d => d)
                    .ToDictionary(d => d.Key, d => d.Count());

                List<RelationCaseEvidenceAnalytic> relationCaseEvidenceAnalytics = await _context.RelationCaseEvidenceAnalytics.Where(x => x.RelationCaseEvidenceId == relationCaseEvidence.Id).ToListAsync();

                List<object> noteList = new List<object>();

                foreach (RelationCaseEvidenceAnalytic relationCaseEvidenceAnalytic in relationCaseEvidenceAnalytics)
                {
                    List<object> pictures = new List<object>();

                    TimeSeriesEntry<FaceRecognitionDataTimeSeries>? faceRecognitionDataTimeSeries = faceRecognitionDataTimeSeriesList.Where(frdts => frdts.Value.UnixTimestamp >= relationCaseEvidenceAnalytic.StartTime.Value.ToUnixTimestamp() && frdts.Value.UnixTimestamp <= relationCaseEvidenceAnalytic.EndTime.Value.ToUnixTimestamp()).FirstOrDefault();

                    if (faceRecognitionDataTimeSeries != null)
                    {
                        bool attachmentExists = session.Advanced.Attachments.Exists(videoFootage.VideoFootageId, $"FaceRecognitionDataTimeSeries_{faceRecognitionDataTimeSeries.Timestamp.ToUnixTimestamp()}.jpg");

                        if (attachmentExists)
                        {
                            using (var attachmentResult = session.Advanced.Attachments.Get(videoFootage.VideoFootageId, $"FaceRecognitionDataTimeSeries_{faceRecognitionDataTimeSeries.Timestamp.ToUnixTimestamp()}.jpg"))
                            {
                                var size = attachmentResult.Details.Size;
                                var readBuffer = new byte[size];
                                using (var attachmentMemoryStream = new MemoryStream(readBuffer))
                                {
                                    attachmentResult.Stream.CopyTo(attachmentMemoryStream);
                                }

                                pictures.Add(new
                                {
                                    time = (faceRecognitionDataTimeSeries.Value.UnixTimestamp - videoFootage.StartedAt.Value.ToUnixTimestamp()) * videoFootage.AnalysisSpeedRatio,
                                    picture = Convert.ToBase64String(readBuffer)
                                });
                            }
                        }
                    }

                    TimeSeriesEntry<PeopleAttributeGeneralDataTimeSeries>? peopleAttributeGeneralDataTimeSeries = peopleAttributeGeneralDataTimeSeriesList.Where(pagdts => pagdts.Value.UnixTimestampStart >= relationCaseEvidenceAnalytic.StartTime.Value.ToUnixTimestamp() && pagdts.Value.UnixTimestampStart <= relationCaseEvidenceAnalytic.EndTime.Value.ToUnixTimestamp()).FirstOrDefault();

                    if (peopleAttributeGeneralDataTimeSeries != null)
                    {
                        bool attachmentExists = session.Advanced.Attachments.Exists(videoFootage.VideoFootageId, $"PeopleAttributeDataTimeSeries_{peopleAttributeGeneralDataTimeSeries.Timestamp.ToUnixTimestamp()}.jpg");

                        if (attachmentExists)
                        {
                            using (var attachmentResult = session.Advanced.Attachments.Get(videoFootage.VideoFootageId, $"PeopleAttributeDataTimeSeries_{peopleAttributeGeneralDataTimeSeries.Timestamp.ToUnixTimestamp()}.jpg"))
                            {
                                var size = attachmentResult.Details.Size;
                                var readBuffer = new byte[size];
                                using (var attachmentMemoryStream = new MemoryStream(readBuffer))
                                {
                                    attachmentResult.Stream.CopyTo(attachmentMemoryStream);
                                }

                                pictures.Add(new
                                {
                                    time = (peopleAttributeGeneralDataTimeSeries.Value.UnixTimestampStart - videoFootage.StartedAt.Value.ToUnixTimestamp()) * videoFootage.AnalysisSpeedRatio,
                                    picture = Convert.ToBase64String(readBuffer)
                                });
                            }
                        }
                    }

                    DateTime? addedAt = null;
                    string? addedBy = null;

                    activity = await _context.Activity
                        .Where(a => a.Type == "CASE" && a.Action == "ADD NOTES")
                        .FirstOrDefaultAsync();

                    if (activity != null)
                    {
                        CaseActivity? caseActivity = await _context.CaseActivity
                            .Where(ca => ca.CaseId == relationCaseEvidence.CaseId && ca.ActivityId == activity.ActivityId && ca.RelatedId == relationCaseEvidenceAnalytic.Id)
                            .OrderBy(ca => ca.CreatedAt)
                            .FirstOrDefaultAsync();

                        if (caseActivity != null)
                        {
                            addedAt = caseActivity.CreatedAt;
                            addedBy = await _context.User.Where(u => u.UserId == caseActivity.UserId).Select(u => $"{u.FirstName} {u.LastName}").FirstOrDefaultAsync();
                        }
                    }

                    noteList.Add(new
                    {
                        note = relationCaseEvidenceAnalytic.Notes,
                        level = relationCaseEvidenceAnalytic.Level,
                        pictures = pictures,
                        startTime = (relationCaseEvidenceAnalytic.StartTime.Value.ToUnixTimestamp() - videoFootage.StartedAt.Value.ToUnixTimestamp()) * videoFootage.AnalysisSpeedRatio,
                        endTime = (relationCaseEvidenceAnalytic.EndTime.Value.ToUnixTimestamp() - videoFootage.StartedAt.Value.ToUnixTimestamp()) * videoFootage.AnalysisSpeedRatio,
                        addedAt = addedAt,
                        addedBy = addedBy
                    });
                }

                object notes = new
                {
                    totalEvidenceNote = relationCaseEvidenceAnalytics.Count(),
                    level1 = relationCaseEvidenceAnalytics.Where(x => x.Level == 1).Count(),
                    level2 = relationCaseEvidenceAnalytics.Where(x => x.Level == 2).Count(),
                    level3 = relationCaseEvidenceAnalytics.Where(x => x.Level == 3).Count(),
                    noteList = noteList
                };

                evidences.Add(new
                {
                    name = videoFootage.Name,
                    source = relationCaseEvidence.Evidence.EvidenceSource.Name,
                    location = videoFootage.Location,
                    uploader = await _context.User.Where(u => u.UserId == relationCaseEvidence.Evidence.CreatorUserId).Select(u => u.Type == "SYSTEM ADMIN" ? "System" : $"{u.FirstName} {u.LastName}").FirstOrDefaultAsync(),
                    dateUploaded = dateUploaded,
                    duration = videoFootage.Duration,
                    tags = relationCaseEvidence.Evidence.Tags.OrderBy(et => et.Name).Select(et => et.Name),
                    description = videoFootage.Description,
                    top5DetectedPerson = detectedPersonList.GroupBy(dpl => _context.Person.Where(p => p.PersonNumber == dpl).Select(p => p.Name).FirstOrDefault()).ToDictionary(dpl => dpl.Key, dpl => dpl.Count()).OrderByDescending(x => x.Value).ThenBy(x => x.Key).Take(5).OrderBy(x => x.Value),
                    top5DetectedAttribute = detectedAttributeList.GroupBy(dal => dal).ToDictionary(dal => AddSpacesToCamelCase((string)dal.Key), dal => dal.Count()).OrderByDescending(x => x.Value).ThenBy(x => x.Key).Take(5).OrderBy(x => x.Value),
                    detectionRateAccrossVideoDuration = Enumerable.Range(0, (int)Math.Ceiling((double)videoFootage.Duration / 1000)).Select(d => new { Time = d, Person = personDetectionRate.ContainsKey(d) ? personDetectionRate[d] : 0, Attribute = attributeDetectionRate.ContainsKey(d) ? attributeDetectionRate[d] : 0 }),
                    notes = notes
                });
            }
            
            object evidenceSummary = new
            {
                totalEvidence = relationCaseEvidences.Count(),
                distributionOfSourceOfEvidence = _context.EvidenceSource.GroupBy(es => es.Name).ToDictionary(es => es.Key, es => relationCaseEvidences.Where(x => x.Evidence.EvidenceSource.Name == es.Key).Count()).ToList(),
                evidences = evidences
            };

            List<string> evidenceTagList = new List<string>();

            foreach (List<Tag> tagList in relationCaseEvidences.Select(x => x.Evidence.Tags))
            {
                foreach (Tag tag in tagList)
                {
                    evidenceTagList.Add(tag.Name);
                }
            }

            List<object> evidenceTags = new List<object>();

            foreach (string evidenceTag in evidenceTagList.Distinct().OrderBy(etl => etl))
            {
                List<object> data = new List<object>();

                Tag? tag = await _context.Tag.Where(t => t.Name == evidenceTag).Include(t => t.Evidences).FirstOrDefaultAsync();

                if (tag != null)
                {
                    foreach (Evidence evidence in tag.Evidences)
                    {
                        IDocumentSession session = DocumentStoreHolder.Store.OpenSession();

                        DateTime? addedAt = null;
                        string? addedBy = null;

                        activity = await _context.Activity
                            .Where(a => a.Type == "EVIDENCE" && a.Action == "ADD TAG")
                            .FirstOrDefaultAsync();

                        if (activity != null)
                        {
                            EvidenceActivity? evidenceActivity = await _context.EvidenceActivity
                                .Where(ea => ea.EvidenceId == evidence.EvidenceId && ea.ActivityId == activity.ActivityId && ea.RelatedId == tag.TagId)
                                .OrderByDescending(ea => ea.CreatedAt)
                                .FirstOrDefaultAsync();

                            if (evidenceActivity != null)
                            {
                                addedAt = evidenceActivity.CreatedAt;
                                addedBy = await _context.User.Where(u => u.UserId == evidenceActivity.UserId).Select(u => $"{u.FirstName} {u.LastName}").FirstOrDefaultAsync();
                            }
                        }

                        data.Add(new
                        {
                            evidence = session.Load<VideoFootage>(evidence.EvidenceDocumentId).Name,
                            addedAt = addedAt,
                            addedBy = addedBy
                        });
                    }
                }

                evidenceTags.Add(new
                {
                    evidenceTag = evidenceTag,
                    data = data
                });
            }
            
            object tagSummary = new
            {
                totalEvidenceTag = evidenceTagList.Distinct().Count(),
                top5EvidenceTag = evidenceTagList.GroupBy(etl => etl).ToDictionary(etl => etl.Key, etl => etl.Count()).OrderByDescending(x => x.Value).ThenBy(x => x.Key).Take(5).OrderBy(x => x.Value),
                evidenceTags = evidenceTags
            };

            List<CaseActivitySummary> caseActivitySummary = new List<CaseActivitySummary>();

            List<CaseActivity> caseActivities = await _context.CaseActivity
                .Where(ca => ca.CaseId == _case.CaseId)
                .OrderBy(ca => ca.CreatedAt)
                .ToListAsync();

            foreach (CaseActivity caseActivity in caseActivities.OrderBy(ca => ca.CreatedAt))
            {
                IDocumentSession session = DocumentStoreHolder.Store.OpenSession();

                activity = await _context.Activity
                    .Where(a => a.ActivityId == caseActivity.ActivityId)
                    .FirstOrDefaultAsync();

                if (activity != null)
                {
                    string? additionalInformation = caseActivity.RelatedData;

                    if (activity.Action == "ADD COLLABORATOR")
                    {
                        additionalInformation = await _context.User.Where(u => u.UserId == caseActivity.RelatedId).Select(u => $"{u.FirstName} {u.LastName}").FirstOrDefaultAsync();
                    }
                    else if (activity.Action == "NEW EVIDENCE")
                    {
                        additionalInformation = session.Load<VideoFootage>(await _context.Evidence.Where(e => e.EvidenceId == caseActivity.RelatedId).Select(e => e.EvidenceDocumentId).FirstOrDefaultAsync()).Name;
                    }
                    else if (activity.Action == "LINK EVIDENCE")
                    {
                        additionalInformation = session.Load<VideoFootage>(await _context.Evidence.Where(e => e.EvidenceId == caseActivity.RelatedId).Select(e => e.EvidenceDocumentId).FirstOrDefaultAsync()).Name;
                    }
                    else if (activity.Action == "UNLINK EVIDENCE")
                    {
                        additionalInformation = session.Load<VideoFootage>(await _context.Evidence.Where(e => e.EvidenceId == caseActivity.RelatedId).Select(e => e.EvidenceDocumentId).FirstOrDefaultAsync()).Name;
                    }
                    else if (activity.Action == "ADD NOTES")
                    {
                        additionalInformation = await _context.RelationCaseEvidenceAnalytics.Where(x => x.Id == caseActivity.RelatedId).Select(x => x.Notes).FirstOrDefaultAsync();
                    }
                    else if (activity.Action == "ADD TAG")
                    {
                        additionalInformation = await _context.Tag.Where(t => t.TagId == caseActivity.RelatedId).Select(t => t.Name).FirstOrDefaultAsync();
                    }
                    else if (activity.Action == "DELETE TAG")
                    {
                        additionalInformation = await _context.Tag.Where(t => t.TagId == caseActivity.RelatedId).Select(t => t.Name).FirstOrDefaultAsync();
                    }
                    else if (activity.Action == "ADD EVIDENCE TAG")
                    {
                        EvidenceActivity? evidenceActivity = await _context.EvidenceActivity.FindAsync(caseActivity.RelatedId);

                        if (evidenceActivity != null)
                        {
                            additionalInformation = $"{session.Load<VideoFootage>(await _context.Evidence.Where(e => e.EvidenceId == evidenceActivity.EvidenceId).Select(e => e.EvidenceDocumentId).FirstOrDefaultAsync()).Name}, {await _context.Tag.Where(t => t.TagId == evidenceActivity.RelatedId).Select(t => t.Name).FirstOrDefaultAsync()}";
                        }
                    }
                    else if (activity.Action == "DELETE EVIDENCE TAG")
                    {
                        EvidenceActivity? evidenceActivity = await _context.EvidenceActivity.FindAsync(caseActivity.RelatedId);

                        if (evidenceActivity != null)
                        {
                            additionalInformation = $"{session.Load<VideoFootage>(await _context.Evidence.Where(e => e.EvidenceId == evidenceActivity.EvidenceId).Select(e => e.EvidenceDocumentId).FirstOrDefaultAsync()).Name}, {await _context.Tag.Where(t => t.TagId == evidenceActivity.RelatedId).Select(t => t.Name).FirstOrDefaultAsync()}";
                        }
                    }

                    caseActivitySummary.Add(new CaseActivitySummary
                    {
                        timestamp = caseActivity.CreatedAt,
                        activity = activity.Description,
                        actionBy = await _context.User.Where(u => u.UserId == caseActivity.UserId).Select(u => u.Type == "SYSTEM ADMIN" ? "System" : $"{u.FirstName} {u.LastName}").FirstOrDefaultAsync(),
                        additionalInformation = additionalInformation
                    });
                }
            }
            
            string[] caseRelatedActivityDescription = { "Drafted case", "Created case", "Closed case", "Deleted case", "Added collaborator", "Changed title", "Changed objective", "Added executive summary", "Changed executive summary", "Added conclusion", "Changed conclusion" };
            string[] noteRelatedActivityDescription = { "Added notes" };
            string[] tagRelatedActivityDescription = { "Added tag", "Deleted tag", "Added evidence tag", "Deleted evidence tag" };
            string[] evidenceRelatedActivityDescription = { "New evidence detected", "Linked evidence", "Unlinked evidence" };

            object teamMemberContribution = new
            {
                teamMemberContributionDistribution = teamMember
                    .OrderByDescending(tm => tm.role)
                    .ThenBy(tm => tm.dateJoined)
                    .ThenBy(tm => tm.name)
                    .GroupBy(tm => tm.name)
                    .ToDictionary(tm => tm.Key, tm => (float)caseActivitySummary.Where(cas => cas.actionBy == tm.Key).Count() / caseActivitySummary.Where(cas => teamMember.Select(tm2 => tm2.name).Contains(cas.actionBy)).Count())
                    .ToList(),
                teamMemberContributionOverview = teamMember
                    .OrderByDescending(tm => tm.role)
                    .ThenBy(tm => tm.dateJoined)
                    .ThenBy(tm => tm.name)
                    .GroupBy(tm => tm.name)
                    .ToDictionary(tm => tm.Key, tm => new
                    {
                        caseRelated = caseActivitySummary.Where(cas => cas.actionBy == tm.Key && caseRelatedActivityDescription.Contains(cas.activity)).Count(),
                        noteRelated = caseActivitySummary.Where(cas => cas.actionBy == tm.Key && noteRelatedActivityDescription.Contains(cas.activity)).Count(),
                        tagRelated = caseActivitySummary.Where(cas => cas.actionBy == tm.Key && tagRelatedActivityDescription.Contains(cas.activity)).Count(),
                        evidenceRelated = caseActivitySummary.Where(cas => cas.actionBy == tm.Key && evidenceRelatedActivityDescription.Contains(cas.activity)).Count()
                    })
                    .ToList()
            };

            return Ok(new
            {
                caseId = _case.CaseId,
                title = _case.Title,
                dateOpened = dateOpened,
                creator = creator != null ? $"{creator.FirstName} {creator.LastName}" : null,
                collaborators = collaborators.OrderBy(c => c),
                caseStatus = _case.Status,
                dateClosed = dateClosed,
                durationOfInvestigation = durationOfInvestigation,
                tags = tags,
                teamMember = teamMember.OrderByDescending(tm => tm.role).ThenBy(tm => tm.dateJoined).ThenBy(tm => tm.name),
                personBaseFilter = personBaseFilter,
                attributeBaseFilter = attributeBaseFilter,
                objective = _case.Objective,
                executiveSummary = _case.ExecutiveSummary,
                evidenceSummary = evidenceSummary,
                tagSummary = tagSummary,
                caseActivitySummary = caseActivitySummary,
                teamMemberContribution = teamMemberContribution,
                conclusion = _case.Conclusion
            });
        }

        [HttpPost("collaborator/add")]
        public async Task<ActionResult> AddCaseCollaborator(AddCaseCollaboratorRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            Case? _case = await _context.Case
                .Where(c => c.CaseId == request.caseId)
                .FirstOrDefaultAsync();

            if (_case == null)
            {
                return BadRequest("Case not found.");
            }

            if (_case.CollaboratorUserId.Contains(request.collaboratorUserId))
            {
                return BadRequest("Collaborator already exists.");
            }

            _case.CollaboratorUserId.Add(request.collaboratorUserId);

            Activity? activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "ADD COLLABORATOR")
                .FirstOrDefaultAsync();

            if (activity != null)
            {
                CaseActivity caseActivity = new CaseActivity
                {
                    CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    CaseId = _case.CaseId,
                    ActivityId = activity.ActivityId,
                    RelatedId = request.collaboratorUserId,
                    RelatedData = null,
                    UserId = request.creatorUserId,
                    CreatedAt = dateTime
                };

                _context.CaseActivity.Add(caseActivity);
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("collaborator/list")]
        public async Task<ActionResult> GetCaseCollaboratorList(string userId, string? caseId = null)
        {
            Case? _case = await _context.Case
                .Where(c => c.CaseId == caseId)
                .FirstOrDefaultAsync();

            return Ok(await _context.User.Where(u => u.Type != "SYSTEM ADMIN" && u.UserId != userId && !(_case != null && (_case.CreatorUserId == u.UserId || _case.CollaboratorUserId.Contains(u.UserId)))).OrderBy(u => u.FirstName).ThenBy(u => u.LastName).Select(u => new
            {
                userId = u.UserId,
                name = $"{u.FirstName} {u.LastName}"
            }).ToListAsync());
        }

        [HttpPut("update")]
        public async Task<ActionResult> UpdateCase(UpdateCaseRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            Case? _case = _context.Case.Find(request.caseId);

            if (_case == null)
            {
                return BadRequest("Case not found.");
            }

            if (request.title == null && request.objective == null && request.executiveSummary == null && request.conclusion == null)
            {
                return BadRequest();
            }

            if (request.title != null)
            {
                Activity? activity = await _context.Activity
                    .Where(a => a.Type == "CASE" && a.Action == "CHANGE TITLE")
                    .FirstOrDefaultAsync();

                if (activity != null)
                {
                    CaseActivity caseActivity = new CaseActivity
                    {
                        CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                        CaseId = _case.CaseId,
                        ActivityId = activity.ActivityId,
                        RelatedId = null,
                        RelatedData = _case.Title,
                        UserId = request.creatorUserId, // TAMBAHIN USERID DI REQUEST
                        CreatedAt = dateTime
                    };

                    _context.CaseActivity.Add(caseActivity);
                }

                _case.Title = request.title;
            }

            if (request.objective != null)
            {
                Activity? activity = await _context.Activity
                    .Where(a => a.Type == "CASE" && a.Action == "CHANGE OBJECTIVE")
                    .FirstOrDefaultAsync();

                if (activity != null)
                {
                    CaseActivity caseActivity = new CaseActivity
                    {
                        CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                        CaseId = _case.CaseId,
                        ActivityId = activity.ActivityId,
                        RelatedId = null,
                        RelatedData = _case.Objective,
                        UserId = request.creatorUserId, // TAMBAHIN USERID DI REQUEST
                        CreatedAt = dateTime
                    };

                    _context.CaseActivity.Add(caseActivity);
                }

                _case.Objective = request.objective;
            }

            if (request.executiveSummary != null)
            {
                Activity? activity = null;

                if (_case.ExecutiveSummary == null)
                {
                    activity = await _context.Activity
                        .Where(a => a.Type == "CASE" && a.Action == "ADD EXECUTIVE SUMMARY")
                        .FirstOrDefaultAsync();
                }
                else
                {
                    activity = await _context.Activity
                        .Where(a => a.Type == "CASE" && a.Action == "CHANGE EXECUTIVE SUMMARY")
                        .FirstOrDefaultAsync();
                }

                if (activity != null)
                {
                    CaseActivity caseActivity = new CaseActivity
                    {
                        CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                        CaseId = _case.CaseId,
                        ActivityId = activity.ActivityId,
                        RelatedId = null,
                        RelatedData = _case.ExecutiveSummary == null ? request.executiveSummary : _case.ExecutiveSummary,
                        UserId = request.creatorUserId, // TAMBAHIN USERID DI REQUEST
                        CreatedAt = dateTime
                    };

                    _context.CaseActivity.Add(caseActivity);
                }

                _case.ExecutiveSummary = request.executiveSummary;
            }

            if (request.conclusion != null)
            {
                Activity? activity = null;

                if (_case.Conclusion == null)
                {
                    activity = await _context.Activity
                        .Where(a => a.Type == "CASE" && a.Action == "ADD CONCLUSION")
                        .FirstOrDefaultAsync();
                }
                else
                {
                    activity = await _context.Activity
                        .Where(a => a.Type == "CASE" && a.Action == "CHANGE CONCLUSION")
                        .FirstOrDefaultAsync();
                }

                if (activity != null)
                {
                    CaseActivity caseActivity = new CaseActivity
                    {
                        CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                        CaseId = _case.CaseId,
                        ActivityId = activity.ActivityId,
                        RelatedId = null,
                        RelatedData = _case.Conclusion == null ? request.conclusion : _case.Conclusion,
                        UserId = request.creatorUserId, // TAMBAHIN USERID DI REQUEST
                        CreatedAt = dateTime
                    };

                    _context.CaseActivity.Add(caseActivity);
                }

                _case.Conclusion = request.conclusion;
            }

            _case.UpdatedAt = dateTime;

            _context.SaveChanges();

            return Ok("Update successful.");
        }
    }

    public class TeamMember
    {
        public string name { get; set; }
        public string? picture { get; set; }
        public string email { get; set; }
        public string role { get; set; }
        public DateTime? dateJoined { get; set; }
    }

    public class AttributeBaseFilter
    {
        public string? age { get; set; }
        public string? gender { get; set; }
        public string? hairLength { get; set; }
        public string? upperClothesLength { get; set; }
        public string? upperClothesColor { get; set; }
        public string? lowerClothesLength { get; set; }
        public string? lowerClothesType { get; set; }
        public string? lowerClothesColor { get; set; }
        public string? accessories { get; set; }
    }

    public class CaseActivitySummary
    {
        public DateTime timestamp { get; set; }
        public string activity { get; set; }
        public string actionBy { get; set; }
        public string? additionalInformation { get; set; }
    }
}