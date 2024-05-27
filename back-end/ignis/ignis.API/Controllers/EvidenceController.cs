using ignis.Domain.Model.PostgreSQL;
using ignis.Domain.Model.RavenDB;
using ignis.Domain.Model.Request;
using ignis.Domain.Model.Response;
using ignis.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Raven.Client.Documents.Session;
using Raven.Client.Documents.Session.TimeSeries;
using System.Reflection;
using NReco.VideoInfo;
using Serilog.Sinks.NewRelic.Logs.Sinks.NewRelicLogs;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EvidenceController : ControllerBase
    {
        private readonly ILogger<EvidenceController> _logger;
        private readonly DataContext _context;
        private readonly IHubContext<IgnisHub> _hubContext;
        private readonly TagController _tagController;
#if DEBUG
        static string Media_Root_Folder = "../../media";
#elif RELEASE
        static string Media_Root_Folder = "media";
#endif
        static string Video_Footage_Root_Folder = Media_Root_Folder + "/videoFootage";
        static double attributeThreshold = 0.5;

        public EvidenceController(ILogger<EvidenceController> logger, DataContext context, IHubContext<IgnisHub> hubContext, TagController tagController)
        {
            _logger = logger;
            _context = context;
            _hubContext = hubContext;
            _tagController = tagController;
        }

        private bool CheckEvidenceByFilter(CheckEvidenceByFilterRequest request)
        {
            Evidence? evidence = _context.Evidence
                .Where(e => e.EvidenceId == request.evidenceId)
                .Include(e => e.Tags)
                .FirstOrDefault();

            if (evidence == null)
            {
                return false;
            }

            IDocumentSession session = DocumentStoreHolder.Store.OpenSession();

            VideoFootage? videoFootage = session.Load<VideoFootage>(evidence.EvidenceDocumentId);

            if (videoFootage == null)
            {
                return false;
            }

            if (request.startTime != null && videoFootage.CreatedAt.ToUnixTimestamp() < request.startTime)
            {
                return false;
            }

            if (request.endTime != null && videoFootage.CreatedAt.ToUnixTimestamp() > request.endTime)
            {
                return false;
            }

            if (request.personNumber.Count > 0)
            {
                TimeSeriesEntry<FaceRecognitionDataTimeSeries>[]? faceRecognitionDataTimeSeriesList = session.TimeSeriesFor<FaceRecognitionDataTimeSeries>(videoFootage.VideoFootageId).Get();

                if (faceRecognitionDataTimeSeriesList != null)
                {
                    if (!request.personNumber.All(pn => faceRecognitionDataTimeSeriesList.Select(frdtsl => frdtsl.Value.PersonNumber).ToList().Contains(pn)))
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }

            if (request.generalAttribute.Count > 0)
            {
                TimeSeriesEntry<PeopleAttributeGeneralDataTimeSeries>[]? peopleAttributeGeneralDataTimeSeriesList = session.TimeSeriesFor<PeopleAttributeGeneralDataTimeSeries>(videoFootage.VideoFootageId).Get();

                if (peopleAttributeGeneralDataTimeSeriesList != null)
                {
                    if (!request.generalAttribute
                        .All(ga => peopleAttributeGeneralDataTimeSeriesList
                            .Select(pagdtsl => pagdtsl.Value)
                            .ToList()
                            .Select(x => x.GetType().GetProperties()
                                .Where(p => !p.Name.Contains("UnixTimestamp") && Convert.ToDouble(p.GetValue(x)) >= attributeThreshold)
                                .Select(p => char.ToLower(p.Name[0]) + p.Name.Substring(1)))
                            .ToList()
                            .SelectMany(x => x)
                            .Distinct()
                            .ToList()
                            .Contains(ga)))
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }

            if (request.colorAttribute.Count > 0)
            {
                TimeSeriesEntry<PeopleAttributeColorDataTimeSeries>[]? peopleAttributeColorDataTimeSeriesList = session.TimeSeriesFor<PeopleAttributeColorDataTimeSeries>(videoFootage.VideoFootageId).Get();

                if (peopleAttributeColorDataTimeSeriesList != null)
                {
                    if (!request.colorAttribute
                        .All(ca => peopleAttributeColorDataTimeSeriesList
                            .Select(pacdtsl => pacdtsl.Value)
                            .ToList()
                            .Select(x => x.GetType().GetProperties()
                                .Where(p => Convert.ToDouble(p.GetValue(x)) >= attributeThreshold)
                                .Select(p => char.ToLower(p.Name[0]) + p.Name.Substring(1)))
                            .ToList()
                            .SelectMany(x => x)
                            .Distinct()
                            .ToList()
                            .Contains(ca)))
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }

            if (request.tagId.Count > 0)
            {
                if (!request.tagId.All(ti => evidence.Tags.Select(et => et.TagId).ToList().Contains(ti)))
                {
                    return false;
                }
            }

            return true;
        }

        [HttpGet("signalRDummy/evidence/addVideoFootage")]
        public async Task<ActionResult> AddVideoFootageSignalRDummyEvidence()
        {
            ActionResult<GetVideoFootageResponse> getVideoFootageResponseActionResult = await GetVideoFootage("VideoFootage/ea868b76-1fcb-43f0-ad7e-00d18c5be38d");

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "add video footage", JsonConvert.SerializeObject(getVideoFootageResponseActionResult.Value));

            return Ok();
        }

        [HttpGet("signalRDummy/evidence/updateVideoFootage")]
        public async Task<ActionResult> UpdateVideoFootageSignalRDummyEvidence()
        {
            ActionResult<GetVideoFootageResponse> getVideoFootageResponseActionResult = await GetVideoFootage("VideoFootage/ea868b76-1fcb-43f0-ad7e-00d18c5be38d");

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "update video footage", JsonConvert.SerializeObject(getVideoFootageResponseActionResult.Value));

            return Ok();
        }

        [HttpGet("signalRDummy/analyzeCase/newEvidence")]
        public async Task<ActionResult> NewEvidenceSignalRDummyAnalyzeCase()
        {
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "new evidence", JsonConvert.SerializeObject(new
            {
                evidenceId = "77042354-704f-4338-9e85-c052b6d730cd",
                evidenceName = "DRONE-2_Demo Mahasiswa.mp4"
            }));

            return Ok();
        }

        [HttpPost("add")]
        public async Task<ActionResult<Evidence>> AddEvidence(AddEvidenceRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            if (_context.Evidence.Any(e => e.EvidenceDocumentId == request.evidenceDocumentId))
            {
                return BadRequest("Evidence already exists.");
            }

            User? creator = await _context.User.FindAsync(request.creatorUserId);

            if (creator == null)
            {
                return BadRequest("User not found.");
            }

            EvidenceSource? evidenceSource = await _context.EvidenceSource.FindAsync(request.evidenceSourceId);

            if (evidenceSource == null)
            {
                return BadRequest("Evidence source not found.");
            }

            Evidence evidence = new Evidence()
            {
                EvidenceId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                EvidenceDocumentId = request.evidenceDocumentId,
                Type = request.type,
                CreatedAt = dateTime,
                UpdatedAt = dateTime,
                Creator = creator,
                EvidenceSource = evidenceSource
            };

            _context.Evidence.Add(evidence);

            await _context.SaveChangesAsync();

            return evidence;
        }

        [HttpPost("attachment/add")]
        [DisableRequestSizeLimit]
        public async Task<ActionResult> AddEvidenceAttachment([FromForm] AddEvidenceAttachmentRequest request)
        {
            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            using (Stream stream = request.attachment.OpenReadStream())
            {
                session.Advanced.Attachments.Store(request.documentId, request.attachmentName, stream, request.contentType);

                session.SaveChanges();
            }

            return Ok("Evidence attachment added.");
        }

        [HttpPost("videofootage/add")]
        [DisableRequestSizeLimit]
        public async Task<ActionResult> AddVideoFootage([FromForm] AddVideoFootageRequest request)
        {
            AddEvidenceRequest addEvidenceRequest = new AddEvidenceRequest()
            {
                creatorUserId = request.creatorUserId,
                evidenceSourceId = request.evidenceSourceId != null ? request.evidenceSourceId : await _context.EvidenceSource.Where(es => es.Name == "Others").Select(es => es.EvidenceSourceId).FirstOrDefaultAsync(),
                evidenceDocumentId = $"VideoFootage/{string.Join("", Guid.NewGuid().ToString().ToArray())}",
                type = "VIDEO FOOTAGE"
            };

            ActionResult<Evidence> evidenceActionResult = await AddEvidence(addEvidenceRequest);

            if (evidenceActionResult == null)
            {
                return BadRequest("Evidence not found.");
            }

            DateTime dateTime = DateTime.UtcNow;

            VideoFootage videoFootage = new VideoFootage()
            {
                VideoFootageId = evidenceActionResult.Value.EvidenceDocumentId,
                EvidenceId = evidenceActionResult.Value.EvidenceId,
                Name = request.name != null ? request.name : request.file != null ? request.file.FileName : "",
                Location = request.location,
                Latitude = request.latitude,
                Longitude = request.longitude,
                RecordingStartedAt = request.recordingStartedAt,
                Duration = null,
                OriginalVideoUrl = null,
                AnalysisSpeedRatio = 2,
                Channel = null,
                StartedAt = null,
                EndedAt = null,
                IsCompressed = false,
                Status = "NEW",
                Description = request.description,
                CreatedAt = dateTime,
                UpdatedAt = dateTime
            };

            if (request.file != null)
            {
                string videoFootageDirectory = $"{Video_Footage_Root_Folder}/{videoFootage.VideoFootageId.Split('/')[1]}";

                if (!Directory.Exists(videoFootageDirectory))
                {
                    Directory.CreateDirectory(videoFootageDirectory);
                }

                videoFootage.OriginalVideoUrl = $"{videoFootageDirectory}/{videoFootage.VideoFootageId.Split('/')[1]}{Path.GetExtension(request.file.FileName)}";

                using (var stream = new FileStream(videoFootage.OriginalVideoUrl, FileMode.Create))
                {
                    request.file.CopyTo(stream);
                }

                FFProbe ffProbe = new FFProbe();
                MediaInfo videoInfo = ffProbe.GetMediaInfo(videoFootage.OriginalVideoUrl);

                videoFootage.Duration = (long)videoInfo.Duration.TotalMilliseconds;
                videoFootage.Status = "WAITING";

                Activity? activity = await _context.Activity
                    .Where(a => a.Type == "EVIDENCE" && a.Action == "ADD VIDEO")
                    .FirstOrDefaultAsync();

                if (activity != null)
                {
                    EvidenceActivity evidenceActivity = new EvidenceActivity
                    {
                        EvidenceActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                        EvidenceId = videoFootage.EvidenceId,
                        ActivityId = activity.ActivityId,
                        RelatedId = null,
                        UserId = request.creatorUserId,
                        CreatedAt = videoFootage.CreatedAt
                    };

                    _context.EvidenceActivity.Add(evidenceActivity);
                }
            }

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                session.Store(videoFootage, videoFootage.VideoFootageId);

                session.SaveChanges();
            }

            await _context.SaveChangesAsync();

            ActionResult<GetVideoFootageResponse> getVideoFootageResponseActionResult = await GetVideoFootage(videoFootage.VideoFootageId);

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "add video footage", JsonConvert.SerializeObject(getVideoFootageResponseActionResult.Value));

            return Ok(videoFootage.VideoFootageId);
        }

        [HttpPost("tag/add")]
        public async Task<ActionResult> AddEvidenceTag(AddEvidenceTagRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            Evidence? evidence = await _context.Evidence
                .Where(e => e.EvidenceId == request.evidenceId)
                .Include(e => e.Tags)
                .FirstOrDefaultAsync();

            if (evidence == null)
            {
                return BadRequest("Evidence not found.");
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

            evidence.Tags.Add(tag);

            Activity? activity = await _context.Activity
                .Where(a => a.Type == "EVIDENCE" && a.Action == "ADD TAG")
                .FirstOrDefaultAsync();

            if (activity != null)
            {
                EvidenceActivity evidenceActivity = new EvidenceActivity
                {
                    EvidenceActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    EvidenceId = evidence.EvidenceId,
                    ActivityId = activity.ActivityId,
                    RelatedId = tag.TagId,
                    UserId = request.creatorUserId,
                    CreatedAt = dateTime
                };

                _context.EvidenceActivity.Add(evidenceActivity);

                if (request.caseId != null)
                {
                    activity = await _context.Activity
                        .Where(a => a.Type == "CASE" && a.Action == "ADD EVIDENCE TAG")
                        .FirstOrDefaultAsync();

                    if (activity != null)
                    {
                        CaseActivity caseActivity = new CaseActivity
                        {
                            CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                            CaseId = request.caseId,
                            ActivityId = activity.ActivityId,
                            RelatedId = evidenceActivity.EvidenceActivityId,
                            RelatedData = null,
                            UserId = request.creatorUserId,
                            CreatedAt = dateTime
                        };

                        _context.CaseActivity.Add(caseActivity);
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(tag.TagId);
        }

        [HttpGet("tag/list")]
        public async Task<ActionResult> GetEvidenceTagList(string evidenceId)
        {
            return Ok(await _context.Evidence
                .Where(e => e.EvidenceId == evidenceId)
                .Include(e => e.Tags)
                .Select(e => e.Tags)
                .FirstOrDefaultAsync());
        }

        [HttpDelete("tag/delete")]
        public async Task<ActionResult> DeleteEvidenceTag(DeleteEvidenceTagRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            Evidence? evidence = await _context.Evidence
                .Where(e => e.EvidenceId == request.evidenceId)
                .Include(e => e.Tags)
                .FirstOrDefaultAsync();

            if (evidence == null)
            {
                return BadRequest("Evidence not found.");
            }

            Tag? tag = await _context.Tag.FindAsync(request.tagId);

            if (tag == null)
            {
                return BadRequest("Tag not found.");
            }

            evidence.Tags.Remove(tag);

            Activity? activity = await _context.Activity
                .Where(a => a.Type == "EVIDENCE" && a.Action == "DELETE TAG")
                .FirstOrDefaultAsync();

            if (activity != null)
            {
                EvidenceActivity evidenceActivity = new EvidenceActivity
                {
                    EvidenceActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    EvidenceId = evidence.EvidenceId,
                    ActivityId = activity.ActivityId,
                    RelatedId = tag.TagId,
                    UserId = request.creatorUserId,
                    CreatedAt = dateTime
                };

                _context.EvidenceActivity.Add(evidenceActivity);

                if (request.caseId != null)
                {
                    activity = await _context.Activity
                        .Where(a => a.Type == "CASE" && a.Action == "DELETE EVIDENCE TAG")
                        .FirstOrDefaultAsync();

                    if (activity != null)
                    {
                        CaseActivity caseActivity = new CaseActivity
                        {
                            CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                            CaseId = request.caseId,
                            ActivityId = activity.ActivityId,
                            RelatedId = evidenceActivity.EvidenceActivityId,
                            RelatedData = null,
                            UserId = request.creatorUserId,
                            CreatedAt = dateTime
                        };

                        _context.CaseActivity.Add(caseActivity);
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("videofootage/tocompress")]
        public async Task<ActionResult> GetVideoFootageToCompress()
        {
            GetVideoFootageToCompressResponse? getVideoFootageToCompressResponse = null;

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                VideoFootage? videoFootage = session.Query<VideoFootage>().Where(vf => vf.IsCompressed == false).OrderBy(vf => vf.CreatedAt).FirstOrDefault();

                if (videoFootage != null)
                {
                    getVideoFootageToCompressResponse = new GetVideoFootageToCompressResponse
                    {
                        videoFootageId = videoFootage.VideoFootageId,
                        originalVideoUrl = videoFootage.OriginalVideoUrl
                    };
                }
            }

            return Ok(getVideoFootageToCompressResponse);
        }

        [HttpGet("videofootage/toanalyze")]
        public async Task<ActionResult> GetVideoFootageToAnalyze()
        {
            GetVideoFootageToAnalyzeResponse? getVideoFootageToAnalyzeResponse = null;

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                VideoFootage? videoFootage = session.Query<VideoFootage>().Where(vf => vf.Status == "WAITING").OrderBy(vf => vf.CreatedAt).FirstOrDefault();

                if (videoFootage != null)
                {
                    getVideoFootageToAnalyzeResponse = new GetVideoFootageToAnalyzeResponse
                    {
                        videoFootageId = videoFootage.VideoFootageId,
                        originalVideoUrl = videoFootage.OriginalVideoUrl,
                        analysisSpeedRatio = videoFootage.AnalysisSpeedRatio
                    };
                }
            }

            return Ok(getVideoFootageToAnalyzeResponse);
        }

        [HttpPut("videofootage/updatefile")]
        [DisableRequestSizeLimit]
        public async Task<ActionResult> UpdateFileVideoFootage([FromForm] UpdateFileVideoFootageRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                VideoFootage? videoFootage = session.Load<VideoFootage>(request.videoFootageId);

                if (videoFootage == null)
                {
                    return NotFound("Video footage not found.");
                }

                string videoFootageDirectory = $"{Video_Footage_Root_Folder}/{videoFootage.VideoFootageId.Split('/')[1]}";

                if (!Directory.Exists(videoFootageDirectory))
                {
                    Directory.CreateDirectory(videoFootageDirectory);
                }

                videoFootage.OriginalVideoUrl = $"{videoFootageDirectory}/{videoFootage.VideoFootageId.Split('/')[1]}{Path.GetExtension(request.file.FileName)}";

                using (var stream = new FileStream(videoFootage.OriginalVideoUrl, FileMode.Create))
                {
                    request.file.CopyTo(stream);
                }

                videoFootage.Duration = request.duration;
                videoFootage.Status = "WAITING";
                videoFootage.UpdatedAt = dateTime;

                session.SaveChanges();

                Evidence? evidence = await _context.Evidence.FindAsync(videoFootage.EvidenceId);

                Activity? activity = await _context.Activity
                    .Where(a => a.Type == "EVIDENCE" && a.Action == "ADD VIDEO")
                    .FirstOrDefaultAsync();

                if (evidence != null && activity != null)
                {
                    EvidenceActivity evidenceActivity = new EvidenceActivity
                    {
                        EvidenceActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                        EvidenceId = videoFootage.EvidenceId,
                        ActivityId = activity.ActivityId,
                        RelatedId = null,
                        UserId = evidence.CreatorUserId,
                        CreatedAt = videoFootage.UpdatedAt
                    };

                    _context.EvidenceActivity.Add(evidenceActivity);

                    await _context.SaveChangesAsync();
                }
            }

            ActionResult<GetVideoFootageResponse> getVideoFootageResponseActionResult = await GetVideoFootage(request.videoFootageId);

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "update video footage", JsonConvert.SerializeObject(getVideoFootageResponseActionResult.Value));

            return Ok("Update successful.");
        }

        [HttpPut("videofootage/updatechannel")]
        public async Task<ActionResult> UpdateChannelVideoFootage(UpdateChannelVideoFootageRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                VideoFootage? videoFootage = session.Load<VideoFootage>(request.videoFootageId);

                if (videoFootage == null)
                {
                    return NotFound("Video footage not found.");
                }

                videoFootage.Channel = request.channel;
                videoFootage.UpdatedAt = dateTime;

                session.SaveChanges();
            }

            return Ok("Update successful.");
        }

        [HttpPut("videofootage/updatestartedat")]
        public async Task<ActionResult> UpdateStartedAtVideoFootage(UpdateStartedAtVideoFootageRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                VideoFootage? videoFootage = session.Load<VideoFootage>(request.videoFootageId);

                if (videoFootage == null)
                {
                    return NotFound("Video footage not found.");
                }

                videoFootage.StartedAt = request.startedAt;
                videoFootage.UpdatedAt = dateTime;

                session.SaveChanges();
            }

            return Ok("Update successful.");
        }

        [HttpPut("videofootage/updateendedat")]
        public async Task<ActionResult> UpdateEndedAtVideoFootage(UpdateEndedAtVideoFootageRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                VideoFootage? videoFootage = session.Load<VideoFootage>(request.videoFootageId);

                if (videoFootage == null)
                {
                    return NotFound("Video footage not found.");
                }

                videoFootage.EndedAt = request.endedAt;
                videoFootage.UpdatedAt = dateTime;

                session.SaveChanges();
            }

            return Ok("Update successful.");
        }

        [HttpPut("videofootage/updateiscompressed")]
        public async Task<ActionResult> UpdateIsCompressedVideoFootage(UpdateIsCompressedVideoFootageRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                VideoFootage? videoFootage = session.Load<VideoFootage>(request.videoFootageId);

                if (videoFootage == null)
                {
                    return NotFound("Video footage not found.");
                }

                videoFootage.IsCompressed = request.isCompressed;
                videoFootage.UpdatedAt = dateTime;

                session.SaveChanges();
            }

            ActionResult<GetVideoFootageResponse> getVideoFootageResponseActionResult = await GetVideoFootage(request.videoFootageId);

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "update video footage", JsonConvert.SerializeObject(getVideoFootageResponseActionResult.Value));

            return Ok("Update successful.");
        }

        [HttpPut("videofootage/updatestatus")]
        public async Task<ActionResult> UpdateStatusVideoFootage(UpdateStatusVideoFootageRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                VideoFootage? videoFootage = session.Load<VideoFootage>(request.videoFootageId);

                if (videoFootage == null)
                {
                    return NotFound("Video footage not found.");
                }

                videoFootage.Status = request.status;
                videoFootage.UpdatedAt = dateTime;

                session.SaveChanges();

                Evidence? evidence = await _context.Evidence.FindAsync(videoFootage.EvidenceId);

                Activity? activity = null;

                if (request.status == "ANALYZING")
                {
                    activity = await _context.Activity
                        .Where(a => a.Type == "EVIDENCE" && a.Action == "ANALYZE VIDEO STARTED")
                        .FirstOrDefaultAsync();
                }
                else if (request.status == "COMPLETED")
                {
                    activity = await _context.Activity
                        .Where(a => a.Type == "EVIDENCE" && a.Action == "ANALYZE VIDEO COMPLETED")
                        .FirstOrDefaultAsync();
                }

                if (evidence != null && activity != null)
                {
                    EvidenceActivity evidenceActivity = new EvidenceActivity
                    {
                        EvidenceActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                        EvidenceId = videoFootage.EvidenceId,
                        ActivityId = activity.ActivityId,
                        RelatedId = null,
                        UserId = evidence.CreatorUserId,
                        CreatedAt = videoFootage.UpdatedAt
                    };

                    _context.EvidenceActivity.Add(evidenceActivity);

                    await _context.SaveChangesAsync();
                }

                if (request.status == "COMPLETED")
                {
                    activity = await _context.Activity
                        .Where(a => a.Type == "CASE" && a.Action == "NEW EVIDENCE")
                        .FirstOrDefaultAsync();

                    if (activity != null)
                    {
                        List<Case> cases = await _context.Case
                            .Where(c => c.Status == "ONGOING")
                            .ToListAsync();

                        // FILTER CASES LOGIC (OPTIONAL)

                        //

                        foreach (Case _case in cases)
                        {
                            if (evidence != null)
                            {
                                RelationCaseEvidence relationCaseEvidence = new RelationCaseEvidence
                                {
                                    Id = string.Join("", Guid.NewGuid().ToString().ToArray()),
                                    CaseId = _case.CaseId,
                                    EvidenceId = evidence.EvidenceId,
                                    Status = "NEW"
                                };

                                _context.RelationCaseEvidences.Add(relationCaseEvidence);

                                CaseActivity caseActivity = new CaseActivity
                                {
                                    CaseActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                                    CaseId = relationCaseEvidence.CaseId,
                                    ActivityId = activity.ActivityId,
                                    RelatedId = relationCaseEvidence.EvidenceId,
                                    RelatedData = null,
                                    UserId = evidence.CreatorUserId,
                                    CreatedAt = DateTime.UtcNow
                                };

                                _context.CaseActivity.Add(caseActivity);

                                await _context.SaveChangesAsync();
                            }
                        }

                        await _hubContext.Clients.All.SendAsync("ReceiveMessage", "new evidence", JsonConvert.SerializeObject(new
                        {
                            evidenceId = videoFootage.EvidenceId,
                            evidenceName = videoFootage.Name
                        }));
                    }
                }
            }

            ActionResult<GetVideoFootageResponse> getVideoFootageResponseActionResult = await GetVideoFootage(request.videoFootageId);

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "update video footage", JsonConvert.SerializeObject(getVideoFootageResponseActionResult.Value));

            return Ok("Update successful.");
        }

        [HttpPut("videofootage/update")]
        public async Task<ActionResult> UpdateVideoFootage(UpdateVideoFootageRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                VideoFootage? videoFootage = session.Load<VideoFootage>(request.videoFootageId);

                if (videoFootage == null)
                {
                    return NotFound("Video footage not found.");
                }

                videoFootage.Name = request.name;
                videoFootage.Location = request.location;
                videoFootage.Latitude = request.latitude;
                videoFootage.Longitude = request.longitude;
                videoFootage.UpdatedAt = dateTime;

                session.SaveChanges();
            }

            return Ok("Update successful.");
        }

        [HttpGet("videofootage/list")]
        public async Task<ActionResult> GetVideoFootageList(string? status = null)
        {
            List<VideoFootage> videoFootages = new List<VideoFootage>();
            List<GetVideoFootageResponse> getVideoFootageListResponse = new List<GetVideoFootageResponse>();

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                videoFootages = session.Query<VideoFootage>().OrderByDescending(vf => vf.CreatedAt).ToList();
            }

            if (status != null)
            {
                videoFootages = videoFootages.FindAll(vf => vf.Status == status);
            }

            foreach (VideoFootage videoFootage in videoFootages)
            {
                string? creatorUserName = null;
                List<GetVideoFootageTagResponse> tags = new List<GetVideoFootageTagResponse>();

                Evidence? evidence = await _context.Evidence
                    .Where(e => e.EvidenceId == videoFootage.EvidenceId)
                    .Include(e => e.Tags)
                    .FirstOrDefaultAsync();

                if (evidence != null)
                {
                    creatorUserName = await _context.User.Where(u => u.UserId == evidence.CreatorUserId).Select(u => $"{u.FirstName} {u.LastName}").FirstOrDefaultAsync();

                    foreach (Tag tag in evidence.Tags)
                    {
                        tags.Add(new GetVideoFootageTagResponse
                        {
                            tagId = tag.TagId,
                            tagName = tag.Name
                        });
                    }
                }

                getVideoFootageListResponse.Add(new GetVideoFootageResponse
                {
                    videoFootageId = videoFootage.VideoFootageId,
                    evidenceId = videoFootage.EvidenceId,
                    name = videoFootage.Name,
                    location = videoFootage.Location,
                    latitude = videoFootage.Latitude,
                    longitude = videoFootage.Longitude,
                    recordingStartedAt = videoFootage.RecordingStartedAt,
                    duration = videoFootage.Duration,
                    originalVideoUrl = videoFootage.OriginalVideoUrl,
                    analysisSpeedRatio = videoFootage.AnalysisSpeedRatio,
                    channel = videoFootage.Channel,
                    startedAt = videoFootage.StartedAt,
                    endedAt = videoFootage.EndedAt,
                    isCompressed = videoFootage.IsCompressed,
                    status = videoFootage.Status,
                    description = videoFootage.Description,
                    createdAt = videoFootage.CreatedAt,
                    updatedAt = videoFootage.UpdatedAt,
                    creatorUserName = creatorUserName != null ? creatorUserName : "",
                    tags = tags
                });
            }

            return Ok(getVideoFootageListResponse);
        }

        [HttpGet("videofootage")]
        public async Task<ActionResult<GetVideoFootageResponse>> GetVideoFootage(string videoFootageId)
        {
            VideoFootage videoFootage = new VideoFootage();

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                videoFootage = session.Load<VideoFootage>(videoFootageId);

                if (videoFootage == null)
                {
                    return NotFound("Video footage not found.");
                }
            }

            string? creatorUserName = null;
            List<GetVideoFootageTagResponse> tags = new List<GetVideoFootageTagResponse>();

            Evidence? evidence = await _context.Evidence
                .Where(e => e.EvidenceId == videoFootage.EvidenceId)
                .Include(e => e.Tags)
                .FirstOrDefaultAsync();

            if (evidence != null)
            {
                creatorUserName = await _context.User.Where(u => u.UserId == evidence.CreatorUserId).Select(u => $"{u.FirstName} {u.LastName}").FirstOrDefaultAsync();

                foreach (Tag tag in evidence.Tags)
                {
                    tags.Add(new GetVideoFootageTagResponse
                    {
                        tagId = tag.TagId,
                        tagName = tag.Name
                    });
                }
            }

            GetVideoFootageResponse getVideoFootageResponse = new GetVideoFootageResponse
            {
                videoFootageId = videoFootage.VideoFootageId,
                evidenceId = videoFootage.EvidenceId,
                name = videoFootage.Name,
                location = videoFootage.Location,
                latitude = videoFootage.Latitude,
                longitude = videoFootage.Longitude,
                recordingStartedAt = videoFootage.RecordingStartedAt,
                duration = videoFootage.Duration,
                originalVideoUrl = videoFootage.OriginalVideoUrl,
                analysisSpeedRatio = videoFootage.AnalysisSpeedRatio,
                channel = videoFootage.Channel,
                startedAt = videoFootage.StartedAt,
                endedAt = videoFootage.EndedAt,
                isCompressed = videoFootage.IsCompressed,
                status = videoFootage.Status,
                description = videoFootage.Description,
                createdAt = videoFootage.CreatedAt,
                updatedAt = videoFootage.UpdatedAt,
                creatorUserName = creatorUserName != null ? creatorUserName : "",
                tags = tags
            };

            return getVideoFootageResponse;
        }

        [HttpPost("analytic/add")]
        public async Task<ActionResult> AddEvidenceAnalytic(AddEvidenceAnalyticRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            User? creator = await _context.User.FindAsync(request.creatorUserId);

            if (creator == null)
            {
                return BadRequest("User not found.");
            }

            Evidence? evidence = await _context.Evidence.FindAsync(request.evidenceId);

            if (evidence == null)
            {
                return BadRequest("Evidence not found.");
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

            EvidenceAnalytic evidenceAnalytic = new EvidenceAnalytic
            {
                EvidenceAnalyticId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                StartTime = videoFootage.StartedAt.Value.AddSeconds(request.startTime / videoFootage.AnalysisSpeedRatio),
                EndTime = videoFootage.StartedAt.Value.AddSeconds(request.endTime / videoFootage.AnalysisSpeedRatio),
                Notes = request.notes,
                Level = request.level,
                CreatedAt = dateTime,
                UpdatedAt = dateTime,
                Creator = creator,
                Evidence = evidence
            };

            _context.EvidenceAnalytic.Add(evidenceAnalytic);

            Activity? activity = await _context.Activity
                .Where(a => a.Type == "EVIDENCE" && a.Action == "ADD NOTES")
                .FirstOrDefaultAsync();

            if (activity != null)
            {
                EvidenceActivity evidenceActivity = new EvidenceActivity
                {
                    EvidenceActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    EvidenceId = evidence.EvidenceId,
                    ActivityId = activity.ActivityId,
                    RelatedId = evidenceAnalytic.EvidenceAnalyticId,
                    UserId = creator.UserId,
                    CreatedAt = evidenceAnalytic.CreatedAt
                };

                _context.EvidenceActivity.Add(evidenceActivity);
            }

            await _context.SaveChangesAsync();

            return Ok(evidenceAnalytic.EvidenceAnalyticId);
        }

        [HttpGet("analytic/list")]
        public async Task<ActionResult> GetEvidenceAnalyticList()
        {
            return Ok(await _context.EvidenceAnalytic.ToListAsync());
        }

        [HttpGet("activity/list")]
        public async Task<ActionResult> GetEvidenceActivityList(string evidenceId)
        {
            List<Object> response = new List<Object>();

            var evidenceActivities = await _context.Evidence
                .Where(e => e.EvidenceId == evidenceId)
                .Include(e => e.EvidenceActivities)
                .Select(e => e.EvidenceActivities)
                .FirstOrDefaultAsync();

            foreach (EvidenceActivity evidenceActivity in evidenceActivities.OrderByDescending(ea => ea.CreatedAt))
            {
                Activity? activity = await _context.Activity.FindAsync(evidenceActivity.ActivityId);
                User? user = await _context.User.FindAsync(evidenceActivity.UserId);

                response.Add(new
                {
                    activity = activity.Description,
                    user = $"{user.FirstName} {user.LastName}",
                    createdAt = evidenceActivity.CreatedAt
                });
            }

            return Ok(response);
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
                    var videoFootage = session.Query<VideoFootage>().Where(x => x.EvidenceId == evidenceId).FirstOrDefault();

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
                    var relationStatus = _context.RelationCaseEvidences.Where(x => x.EvidenceId == evidenceId).Select(x => x.Status).FirstOrDefault();
                    relationStatus = "LINKED";
                }
                _context.SaveChanges();

                var response = new { Message = "New Evidence Has Been Added" };
                return Ok(response);
            }
            return NotFound("Case Not Found");
        }

        [HttpGet("NewEvidenceList")]
        public async Task<ActionResult> GetNewEvidence(string caseId)
        {
            List<object> evidences = new List<object>();
            var evidencesId = _context.RelationCaseEvidences.Where(x => x.CaseId == caseId && x.Status == "NEW").Select(x => x.EvidenceId).ToList();
            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                foreach (var id in evidencesId)
                {
                    var videoFootage = session.Query<VideoFootage>().Where(x => x.EvidenceId == id).FirstOrDefault();
                    var evidencesStatus = _context.RelationCaseEvidences.Where(x => x.EvidenceId == id).Select(x => x.Status).FirstOrDefault();
                    var evidenceRelationId = _context.RelationCaseEvidences.Where(x => x.EvidenceId == id).Select(x => x.Id).FirstOrDefault();
                    var evidence = new
                    {
                        evidenceId = id,
                        evidenceName = videoFootage.Name
                    };
                    evidences.Add(evidence);
                }
            }

            return Ok(evidences);
        }

        [HttpGet("source/createdefault")]
        public async Task<ActionResult> CreateDefaultEvidenceSource()
        {
            EvidenceSource? evidenceSource = new EvidenceSource();

            // Body Worn Camera
            evidenceSource = await _context.EvidenceSource
                .Where(es => es.Name == "Body Worn Camera")
                .FirstOrDefaultAsync();

            if (evidenceSource == null)
            {
                evidenceSource = new EvidenceSource
                {
                    EvidenceSourceId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Name = "Body Worn Camera"
                };

                _context.EvidenceSource.Add(evidenceSource);
            }

            // CCTV
            evidenceSource = await _context.EvidenceSource
                .Where(es => es.Name == "CCTV")
                .FirstOrDefaultAsync();

            if (evidenceSource == null)
            {
                evidenceSource = new EvidenceSource
                {
                    EvidenceSourceId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Name = "CCTV"
                };

                _context.EvidenceSource.Add(evidenceSource);
            }

            // Drone
            evidenceSource = await _context.EvidenceSource
                .Where(es => es.Name == "Drone")
                .FirstOrDefaultAsync();

            if (evidenceSource == null)
            {
                evidenceSource = new EvidenceSource
                {
                    EvidenceSourceId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Name = "Drone"
                };

                _context.EvidenceSource.Add(evidenceSource);
            }

            // Others
            evidenceSource = await _context.EvidenceSource
                .Where(es => es.Name == "Others")
                .FirstOrDefaultAsync();

            if (evidenceSource == null)
            {
                evidenceSource = new EvidenceSource
                {
                    EvidenceSourceId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Name = "Others"
                };

                _context.EvidenceSource.Add(evidenceSource);
            }

            await _context.SaveChangesAsync();

            return Ok("Default evidence source registered.");
        }

        [HttpGet("source/list")]
        public async Task<ActionResult> GetEvidenceSourceList()
        {
            return Ok(await _context.EvidenceSource.OrderBy(es => es.Name).Select(es => new
            {
                evidenceSourceId = es.EvidenceSourceId,
                name = es.Name
            }).ToListAsync());
        }

        [HttpGet("source")]
        public async Task<ActionResult> GetEvidenceSource(string evidenceSourceId)
        {
            return Ok(await _context.EvidenceSource.FindAsync(evidenceSourceId));
        }

        [HttpGet("case/filter")]
        public async Task<ActionResult> FilterCaseEvidence([FromQuery] FilterCaseEvidenceRequest request)
        {
            List<object> evidences = new List<object>();
            List<object> newEvidences = new List<object>();

            foreach (RelationCaseEvidence relationCaseEvidence in await _context.RelationCaseEvidences.Where(x => x.CaseId == request.caseId).Include(x => x.Evidence.Tags).ToListAsync())
            {
                CheckEvidenceByFilterRequest checkEvidenceByFilterRequest = new CheckEvidenceByFilterRequest
                {
                    evidenceId = relationCaseEvidence.EvidenceId,
                    startTime = request.startTime,
                    endTime = request.endTime,
                    personNumber = request.personNumber,
                    generalAttribute = request.generalAttribute,
                    colorAttribute = request.colorAttribute,
                    tagId = request.tagId
                };

                if (CheckEvidenceByFilter(checkEvidenceByFilterRequest))
                {
                    IDocumentSession session = DocumentStoreHolder.Store.OpenSession();

                    VideoFootage? videoFootage = session.Query<VideoFootage>().Where(x => x.EvidenceId == relationCaseEvidence.EvidenceId).FirstOrDefault();

                    if (videoFootage == null)
                    {
                        continue;
                    }

                    List<object> evidenceTags = new List<object>();

                    foreach (Tag tag in relationCaseEvidence.Evidence.Tags)
                    {
                        evidenceTags.Add(new
                        {
                            tagId = tag.TagId,
                            tagName = tag.Name
                        });
                    }

                    if (relationCaseEvidence.Status == "NEW")
                    {
                        newEvidences.Add(new
                        {
                            evidenceId = relationCaseEvidence.EvidenceId,
                            evidenceName = videoFootage.Name,
                            status = relationCaseEvidence.Status,
                            tags = evidenceTags
                        });
                    }
                    else
                    {
                        evidences.Add(new
                        {
                            evidenceId = relationCaseEvidence.EvidenceId,
                            evidenceName = videoFootage.Name,
                            status = relationCaseEvidence.Status,
                            tags = evidenceTags
                        });
                    }
                }
            }

            return Ok(new
            {
                evidences = evidences,
                newEvidences = newEvidences
            });
        }



        [HttpGet("videofootage/forensicdata")]
        public async Task<ActionResult> GetVideoFootageForensicData(string videoFootageId)
        {

            List<object> faceRecogData = new List<object>();


            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                VideoFootage videoFootage = session.Load<VideoFootage>(videoFootageId);

                if (videoFootage == null)
                {
                    return NotFound("Video footage not found.");
                }

                try
                {
                    TimeSeriesEntry<FaceRecognitionDataTimeSeries>[] faceRecognitionDataTimeSeriesList = session.TimeSeriesFor<FaceRecognitionDataTimeSeries>(videoFootageId).Get();

                    foreach (TimeSeriesEntry<FaceRecognitionDataTimeSeries> faceRecognitionDataTimeSeries in faceRecognitionDataTimeSeriesList)
                    {
                        faceRecogData.Add(faceRecognitionDataTimeSeries.Value.PersonNumber);
                    }
                }
                catch (ArgumentNullException)
                {
                    return BadRequest("Document doesn't have face recognition data time series.");
                }
                catch (InvalidOperationException)
                {
                    return BadRequest("Face recognition data time series not found.");
                }

            }

            return Ok(faceRecogData);
        }



    }
}