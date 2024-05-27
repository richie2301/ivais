using ignis.Domain.Model.PostgreSQL;
using ignis.Domain.Model.RavenDB;
using ignis.Domain.Model.Request;
using ignis.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents.Session;
using Raven.Client.Documents.Session.TimeSeries;
using System.Security.Policy;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FaceRecognitionDataController : ControllerBase
    {
        private readonly ILogger<FaceRecognitionDataController> _logger;
        private readonly DataContext _context;
        private readonly TagController _tagController;

        public FaceRecognitionDataController(ILogger<FaceRecognitionDataController> logger, DataContext context, TagController tagController)
        {
            _logger = logger;
            _context = context;
            _tagController = tagController;
        }

        [HttpPost("timeseries/add")]
        public async Task<ActionResult> AddFaceRecognitionDataTimeSeries(AddFaceRecognitionDataTimeSeriesRequest request)
        {
            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                session.TimeSeriesFor<FaceRecognitionDataTimeSeries>(request.documentId)
                    .Append(request.faceRecognitionDataTimestamp, new FaceRecognitionDataTimeSeries
                    {
                        UnixTimestamp = request.unixTimestamp,
                        PersonNumber = request.personNumber,
                        Mask = request.mask == "NO MASK" ? 0 : request.mask == "MASK OK" ? 1 : request.mask == "MASK NG" ? 2 : -1
                    }, request.tag);

                session.SaveChanges();
            }

            return Ok("Face recognition data time series added.");
        }

        [HttpPost("tag/add")]
        public async Task<ActionResult> AddFaceRecognitionDataTimeSeriesTag(AddFaceRecognitionDataTimeSeriesTagRequest request)
        {
            DateTime faceRecognitionDataTimestamp = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc).AddMilliseconds(request.faceRecognitionDataUnixTimestamp);

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                try
                {
                    TimeSeriesEntry<FaceRecognitionDataTimeSeries> faceRecognitionDataTimeSeries = session.TimeSeriesFor<FaceRecognitionDataTimeSeries>(request.documentId).Get().Single(frdts => frdts.Timestamp == faceRecognitionDataTimestamp);
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

            FaceRecognitionDataTimeSeriesTag? faceRecognitionDataTimeSeriesTag = await _context.FaceRecognitionDataTimeSeriesTag
                .Where(frdtst => frdtst.TagId == tag.TagId && frdtst.FaceRecognitionDataTimestamp == faceRecognitionDataTimestamp && frdtst.DocumentId == request.documentId)
                .FirstOrDefaultAsync();

            if (faceRecognitionDataTimeSeriesTag != null)
            {
                return BadRequest("Tag already exists.");
            }

            faceRecognitionDataTimeSeriesTag = new FaceRecognitionDataTimeSeriesTag
            {
                FaceRecognitionDataTimestamp = faceRecognitionDataTimestamp,
                DocumentId = request.documentId,
                Tag = tag
            };

            _context.FaceRecognitionDataTimeSeriesTag.Add(faceRecognitionDataTimeSeriesTag);

            await _context.SaveChangesAsync();

            return Ok(tag.TagId);
        }
    }
}