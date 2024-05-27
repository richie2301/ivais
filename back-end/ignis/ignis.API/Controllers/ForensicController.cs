using ignis.Domain.Model.PostgreSQL;
using ignis.Domain.Model.RavenDB;
using ignis.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents.Session;
using Raven.Client.Documents.Session.TimeSeries;
using Serilog.Sinks.NewRelic.Logs.Sinks.NewRelicLogs;

namespace ignis.API.Controllers
{
    public class ForensicController : Controller
    {
        private readonly ILogger<ForensicController> _logger;
        private readonly DataContext _context;
        static double attributeThreshold = 0.5;

        public ForensicController(ILogger<ForensicController> logger, DataContext context)
        {
            _logger = logger;
            _context = context;
        }


        [HttpGet("EvidenceVideoAttachment")]
        public async Task<ActionResult> GetAttachmentFromEvidence(string videoFootageId)
        {
            string documentId = videoFootageId;
            string[] parts = documentId.Split('/');
            string first = parts[1];
            bool attachmentExists = false;
            string contentType = null;
            string hash = null;
            long size = 0;
            byte[] readBuffer = null;

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                var videoId = first;
                attachmentExists = session.Advanced.Attachments.Exists(videoFootageId, $"{first}_compressed.mp4");

                if (attachmentExists)
                {
                    using (var attachmentResult = session.Advanced.Attachments.Get(videoFootageId, $"{first}_compressed.mp4"))
                    {
                        contentType = attachmentResult.Details.ContentType;
                        hash = attachmentResult.Details.Hash;
                        size = attachmentResult.Details.Size;

                        readBuffer = new byte[size];
                        using (var attachmentMemoryStream = new MemoryStream(readBuffer))
                        {
                            attachmentResult.Stream.CopyTo(attachmentMemoryStream);
                        }
                    }
                }
            }

            if (readBuffer != null && readBuffer.Length > 0)
            {
                // Set the response content type
                Response.Headers.Add("Content-Disposition", "inline; filename=video.mp4");
                Response.Headers.Add("Accept-Ranges", "bytes");
                Response.ContentType = "video/mp4";
                // Return the byte array as a file
                return File(readBuffer, "video/mp4");
            }
            // Return a not found response or handle the case when video data is not available
            return NotFound();
        }


        [HttpGet("GetEvidenceById")]
        public async Task<ActionResult> GetEvidenceById(string videoFootageId)
        {

            List<object> faceRecogData = new List<object>();
            List<object> peopleAttribute = new List<object>();
            List<object> fileResponses = new List<object>();
            List<object> attributeFileResponses = new List<object>();
            var personList = await _context.Person.ToListAsync();
            var videoFootage = new VideoFootage();
            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                videoFootage = session.Query<VideoFootage>().Where(x => x.VideoFootageId == videoFootageId).FirstOrDefault();
                var speedFactor = videoFootage.AnalysisSpeedRatio;
                // Get Person Attribute Data
                var colorTimeSeriesData = session.TimeSeriesFor<PeopleAttributeColorDataTimeSeries>(videoFootageId).Get();
                var generalAttTimeSeriesData = session.TimeSeriesFor<PeopleAttributeGeneralDataTimeSeries>(videoFootageId).Get();
                
                foreach (var general in generalAttTimeSeriesData)
                {
                    var peopleAttributeUnixTimestamp = general.Timestamp.ToUnixTimestamp();
                    bool attributeAttachmentExists = false;
                    attributeAttachmentExists = session.Advanced.Attachments.Exists(videoFootageId, $"PeopleAttributeDataTimeSeries_{peopleAttributeUnixTimestamp}.jpg");

                    if (attributeAttachmentExists)
                    {
                        using (var attachmentResult = session.Advanced.Attachments.Get(videoFootageId, $"PeopleAttributeDataTimeSeries_{peopleAttributeUnixTimestamp}.jpg"))
                        {
                            string contentType = attachmentResult.Details.ContentType;
                            long size = attachmentResult.Details.Size;
                            byte[] readBuffer = new byte[size];
                            using (var attachmentMemoryStream = new MemoryStream(readBuffer))
                            {
                                attachmentResult.Stream.CopyTo(attachmentMemoryStream);
                            }

                            if (readBuffer != null && readBuffer.Length > 0)
                            {
                                var fileContent = Convert.ToBase64String(readBuffer);
                                attributeFileResponses.Add(fileContent);
                            }
                        }
                    }
                        foreach (var color in colorTimeSeriesData)
                        {
                            if (general.Timestamp == color.Timestamp)
                            {
                                peopleAttribute.Add(new
                                {
                                    StartTime = (general.Value.UnixTimestampStart - videoFootage.StartedAt.Value.ToUnixTimestamp()) * speedFactor,
                                    Adult = general.Value.Adult,
                                    Helmet = general.Value.Helmet,
                                    Male = general.Value.Male,
                                    Female = general.Value.Female,
                                    Skirt = general.Value.Skirt,
                                    Young = general.Value.Young,
                                    Bag = general.Value.Bag,
                                    BackBag = general.Value.BackBag,
                                    HairLong = general.Value.HairLong,
                                    HairShort = general.Value.HairShort,
                                    Hat = general.Value.Hat,
                                    UpperLengthLong = general.Value.UpperLengthLong,
                                    UpperLengthShort = general.Value.UpperLengthShort,
                                    LowerLengthLong = general.Value.LowerLengthLong,
                                    LowerLengthShort = general.Value.LowerLengthShort,
                                    Pants = general.Value.Pants,
                                    UpperColorBlack = color.Value.UpperColorBlack,
                                    UpperColorWhite = color.Value.UpperColorWhite,
                                    UpperColorRed = color.Value.UpperColorRed,
                                    UpperColorGreen = color.Value.UpperColorGreen,
                                    UpperColorYellow = color.Value.UpperColorYellow,
                                    UpperColorOrange = color.Value.UpperColorOrange,
                                    UpperColorPurple = color.Value.UpperColorPurple,
                                    UpperColorPink = color.Value.UpperColorPink,
                                    UpperColorBlue = color.Value.UpperColorBlue,
                                    UpperColorGray = color.Value.UpperColorGray,
                                    LowerColorBlack = color.Value.LowerColorBlack,
                                    LowerColorWhite = color.Value.LowerColorWhite,
                                    LowerColorRed = color.Value.LowerColorRed,
                                    LowerColorGreen = color.Value.LowerColorGreen,
                                    LowerColorYellow = color.Value.LowerColorYellow,
                                    LowerColorOrange = color.Value.LowerColorOrange,
                                    LowerColorPurple = color.Value.LowerColorPurple,
                                    LowerColorPink = color.Value.LowerColorPink,
                                    LowerColorBlue = color.Value.LowerColorBlue,
                                    LowerColorGray = color.Value.LowerColorGray
                                });
                            }
                        
                    
                    }
                }

                // Get Face Data
                try
                {
                    // Change photo into JSON

                    var faceRecognitionData = session.TimeSeriesFor<FaceRecognitionDataTimeSeries>(videoFootageId).Get();

                    foreach (var faceData in faceRecognitionData)
                    {
                        var unixTimestamp = faceData.Timestamp.ToUnixTimestamp();
                        bool attachmentExists = false;
                        attachmentExists = session.Advanced.Attachments.Exists(videoFootageId, $"FaceRecognitionDataTimeSeries_{unixTimestamp}.jpg");

                        if (attachmentExists)
                        {
                            using (var attachmentResult = session.Advanced.Attachments.Get(videoFootageId, $"FaceRecognitionDataTimeSeries_{unixTimestamp}.jpg"))
                            {
                                string contentType = attachmentResult.Details.ContentType;
                                long size = attachmentResult.Details.Size;
                                byte[] readBuffer = new byte[size];
                                using (var attachmentMemoryStream = new MemoryStream(readBuffer))
                                {
                                    attachmentResult.Stream.CopyTo(attachmentMemoryStream);
                                }

                                if (readBuffer != null && readBuffer.Length > 0)
                                {
                                    var fileContent = Convert.ToBase64String(readBuffer);

                                    foreach (var person in personList)
                                    {
                                        if ((double)person.PersonNumber == faceData.Value.PersonNumber)
                                        {
                                            faceRecogData.Add(new
                                            {
                                                timeStamp = (faceData.Value.UnixTimestamp - videoFootage.StartedAt.Value.ToUnixTimestamp()) * speedFactor,
                                                name = person.Name,
                                                personNumber = faceData.Value.PersonNumber,
                                                photo = fileContent
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                }
            }

            // Use LINQ to filter out properties with values equal to 0 for each object
            var filteredPeopleAttribute = peopleAttribute.Select(peopleData =>
                peopleData.GetType().GetProperties()
                    .Where(property => Convert.ToDecimal(property.GetValue(peopleData)) > 0
                    ).ToDictionary(property => property.Name, property => property.GetValue(peopleData))
            ).ToList();

            var videoDetails = new
            {
                name = videoFootage.Name,
                location = videoFootage.Location,
                latitude = videoFootage.Latitude,
                longitude = videoFootage.Longitude,
                startTime = videoFootage.StartedAt,
                attributePhotos = attributeFileResponses,
                peopleAttribute = filteredPeopleAttribute,
                faceData = faceRecogData.Distinct(),
            };

            return Ok(videoDetails);
        }

        [HttpGet("GetCaseEvidenceById")]
        public async Task<ActionResult> GetCaseEvidenceById(string evidenceId)
        {
            Evidence? evidence = await _context.Evidence.FindAsync(evidenceId);

            if (evidence == null)
            {
                return NotFound("Evidence not found.");
            }

            IDocumentSession session = DocumentStoreHolder.Store.OpenSession();

            VideoFootage? videoFootage = session.Load<VideoFootage>(evidence.EvidenceDocumentId);

            if (videoFootage == null)
            {
                return NotFound("Video footage not found.");
            }

            List<object> faceRecognitionData = new List<object>();

            TimeSeriesEntry<FaceRecognitionDataTimeSeries>[]? faceRecognitionDataTimeSeriesList = session.TimeSeriesFor<FaceRecognitionDataTimeSeries>(videoFootage.VideoFootageId).Get();

            if (faceRecognitionDataTimeSeriesList != null)
            {
                foreach (TimeSeriesEntry<FaceRecognitionDataTimeSeries> faceRecognitionDataTimeSeries in faceRecognitionDataTimeSeriesList)
                {
                    string? picture = null;

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

                            picture = Convert.ToBase64String(readBuffer);
                        }
                    }

                    faceRecognitionData.Add(new
                    {
                        time = (faceRecognitionDataTimeSeries.Value.UnixTimestamp - videoFootage.StartedAt.Value.ToUnixTimestamp()) * videoFootage.AnalysisSpeedRatio,
                        personNumber = faceRecognitionDataTimeSeries.Value.PersonNumber,
                        name = await _context.Person.Where(p => p.PersonNumber == faceRecognitionDataTimeSeries.Value.PersonNumber).Select(p => p.Name).FirstOrDefaultAsync(),
                        picture = picture
                    });
                }
            }

            List<object> peopleAttributeData = new List<object>();

            TimeSeriesEntry<PeopleAttributeGeneralDataTimeSeries>[]? peopleAttributeGeneralDataTimeSeriesList = session.TimeSeriesFor<PeopleAttributeGeneralDataTimeSeries>(videoFootage.VideoFootageId).Get();
            TimeSeriesEntry<PeopleAttributeColorDataTimeSeries>[]? peopleAttributeColorDataTimeSeriesList = session.TimeSeriesFor<PeopleAttributeColorDataTimeSeries>(videoFootage.VideoFootageId).Get();

            if (peopleAttributeGeneralDataTimeSeriesList != null && peopleAttributeColorDataTimeSeriesList != null)
            {
                foreach (TimeSeriesEntry<PeopleAttributeGeneralDataTimeSeries> peopleAttributeGeneralDataTimeSeries in peopleAttributeGeneralDataTimeSeriesList)
                {
                    TimeSeriesEntry<PeopleAttributeColorDataTimeSeries>? peopleAttributeColorDataTimeSeries = peopleAttributeColorDataTimeSeriesList.FirstOrDefault(pacdtsl => pacdtsl.Timestamp == peopleAttributeGeneralDataTimeSeries.Timestamp);

                    Dictionary<string, object?> generalAttribute = peopleAttributeGeneralDataTimeSeries.Value
                        .GetType()
                        .GetProperties()
                        .Where(p => !p.Name.Contains("UnixTimestamp") && Convert.ToDouble(p.GetValue(peopleAttributeGeneralDataTimeSeries.Value)) >= attributeThreshold)
                        .ToDictionary(p => p.Name, p => p.GetValue(peopleAttributeGeneralDataTimeSeries.Value));

                    Dictionary<string, object?> attribute = generalAttribute;

                    if (peopleAttributeColorDataTimeSeries != null)
                    {
                        Dictionary<string, object?> colorAttribute = peopleAttributeColorDataTimeSeries.Value
                            .GetType()
                            .GetProperties()
                            .Where(p => Convert.ToDouble(p.GetValue(peopleAttributeColorDataTimeSeries.Value)) >= attributeThreshold)
                            .ToDictionary(p => p.Name, p => p.GetValue(peopleAttributeColorDataTimeSeries.Value));

                        attribute = generalAttribute.Concat(colorAttribute).ToDictionary(x => x.Key, x => x.Value);
                    }

                    string? picture = null;

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

                            picture = Convert.ToBase64String(readBuffer);
                        }
                    }

                    peopleAttributeData.Add(new
                    {
                        time = (peopleAttributeGeneralDataTimeSeries.Value.UnixTimestampStart - videoFootage.StartedAt.Value.ToUnixTimestamp()) * videoFootage.AnalysisSpeedRatio,
                        attribute = attribute,
                        picture = picture
                    });
                }
            }

            return Ok(new
            {
                name = videoFootage.Name,
                location = videoFootage.Location,
                latitude = videoFootage.Latitude,
                longitude = videoFootage.Longitude,
                startedAt = videoFootage.StartedAt,
                faceRecognitionData = faceRecognitionData,
                peopleAttributeData = peopleAttributeData
            });
        }

        [HttpGet("CaseEvidenceVideoAttachment")]
        public async Task<ActionResult> GetAttachmentFromCaseEvidence(string evidenceId)
        {
            var videoFootageId = _context.Evidence.Where(x => x.EvidenceId == evidenceId).Select(x => x.EvidenceDocumentId).FirstOrDefault();
            string documentId = videoFootageId;
            string[] parts = documentId.Split('/');
            string first = parts[1];
            bool attachmentExists = false;
            string contentType = null;
            string hash = null;
            long size = 0;
            byte[] readBuffer = null;

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                var videoId = first;
                attachmentExists = session.Advanced.Attachments.Exists(videoFootageId, $"{first}_compressed.mp4");

                if (attachmentExists)
                {
                    using (var attachmentResult = session.Advanced.Attachments.Get(videoFootageId, $"{first}_compressed.mp4"))
                    {
                        contentType = attachmentResult.Details.ContentType;
                        hash = attachmentResult.Details.Hash;
                        size = attachmentResult.Details.Size;

                        readBuffer = new byte[size];
                        using (var attachmentMemoryStream = new MemoryStream(readBuffer))
                        {
                            attachmentResult.Stream.CopyTo(attachmentMemoryStream);
                        }
                    }
                }
            }

            if (readBuffer != null && readBuffer.Length > 0)
            {
                // Set the response content type
                Response.Headers.Add("Content-Disposition", "inline; filename=video.mp4");
                Response.Headers.Add("Accept-Ranges", "bytes");
                Response.ContentType = "video/mp4";
                // Return the byte array as a file
                return File(readBuffer, "video/mp4");
            }
            // Return a not found response or handle the case when video data is not available
            return NotFound();
        }
    }
}