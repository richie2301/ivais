using ignis.Domain.Model.PostgreSQL;
using ignis.Domain.Model.RavenDB;
using ignis.Domain.Model.Request;
using ignis.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents.Session;
using Raven.Client.Documents.Session.TimeSeries;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleAttributeDataController : ControllerBase
    {
        private readonly ILogger<PeopleAttributeDataController> _logger;
        private readonly DataContext _context;
        private readonly TagController _tagController;

        public PeopleAttributeDataController(ILogger<PeopleAttributeDataController> logger, DataContext context, TagController tagController)
        {
            _logger = logger;
            _context = context;
            _tagController = tagController;
        }

        [HttpPost("timeseries/add")]
        public async Task<ActionResult> AddPeopleAttributeDataTimeSeries(AddPeopleAttributeDataTimeSeriesRequest request)
        {
            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                session.TimeSeriesFor<PeopleAttributeGeneralDataTimeSeries>(request.documentId)
                    .Append(request.peopleAttributeDataTimestamp, new PeopleAttributeGeneralDataTimeSeries
                    {
                        UnixTimestampStart = request.unixTimestampStart,
                        UnixTimestampEnd = request.unixTimestampEnd,
                        PersonNumber = request.personNumber,
                        Young = request.young,
                        Adult = request.adult,
                        Male = request.male,
                        Female = request.female,
                        HairShort = request.hairShort,
                        HairLong = request.hairLong,
                        UpperLengthLong = request.upperLengthLong,
                        UpperLengthShort = request.upperLengthShort,
                        LowerLengthLong = request.lowerLengthLong,
                        LowerLengthShort = request.lowerLengthShort,
                        Pants = request.pants,
                        Skirt = request.skirt,
                        Bag = request.bag,
                        Hat = request.hat,
                        Helmet = request.helmet,
                        BackBag = request.backBag
                    }, request.tag);

                session.TimeSeriesFor<PeopleAttributeColorDataTimeSeries>(request.documentId)
                    .Append(request.peopleAttributeDataTimestamp, new PeopleAttributeColorDataTimeSeries
                    {
                        UpperColorBlack = request.upperColorBlack,
                        UpperColorWhite = request.upperColorWhite,
                        UpperColorRed = request.upperColorRed,
                        UpperColorGreen = request.upperColorGreen,
                        UpperColorYellow = request.upperColorYellow,
                        UpperColorOrange = request.upperColorOrange,
                        UpperColorPurple = request.upperColorPurple,
                        UpperColorPink = request.upperColorPink,
                        UpperColorBlue = request.upperColorBlue,
                        UpperColorGray = request.upperColorGray,
                        LowerColorBlack = request.lowerColorBlack,
                        LowerColorWhite = request.lowerColorWhite,
                        LowerColorRed = request.lowerColorRed,
                        LowerColorGreen = request.lowerColorGreen,
                        LowerColorYellow = request.lowerColorYellow,
                        LowerColorOrange = request.lowerColorOrange,
                        LowerColorPurple = request.lowerColorPurple,
                        LowerColorPink = request.lowerColorPink,
                        LowerColorBlue = request.lowerColorBlue,
                        LowerColorGray = request.lowerColorGray
                    }, request.tag);

                session.SaveChanges();
            }

            return Ok("People attribute data time series added.");
        }

        [HttpPost("tag/add")]
        public async Task<ActionResult> AddPeopleAttributeDataTimeSeriesTag(AddPeopleAttributeDataTimeSeriesTagRequest request)
        {
            DateTime peopleAttributeDataTimestamp = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc).AddMilliseconds(request.peopleAttributeDataUnixTimestamp);

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                try
                {
                    TimeSeriesEntry<PeopleAttributeGeneralDataTimeSeries> peopleAttributeGeneralDataTimeSeries = session.TimeSeriesFor<PeopleAttributeGeneralDataTimeSeries>(request.documentId).Get().Single(pagdts => pagdts.Timestamp == peopleAttributeDataTimestamp);
                }
                catch (ArgumentNullException)
                {
                    return BadRequest("Document doesn't have people attribute data time series.");
                }
                catch (InvalidOperationException)
                {
                    return BadRequest("People attribute data time series not found.");
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

            PeopleAttributeDataTimeSeriesTag? peopleAttributeDataTimeSeriesTag = await _context.PeopleAttributeDataTimeSeriesTag
                .Where(padtst => padtst.TagId == tag.TagId && padtst.PeopleAttributeDataTimestamp == peopleAttributeDataTimestamp && padtst.DocumentId == request.documentId)
                .FirstOrDefaultAsync();

            if (peopleAttributeDataTimeSeriesTag != null)
            {
                return BadRequest("Tag already exists.");
            }

            peopleAttributeDataTimeSeriesTag = new PeopleAttributeDataTimeSeriesTag
            {
                PeopleAttributeDataTimestamp = peopleAttributeDataTimestamp,
                DocumentId = request.documentId,
                Tag = tag
            };

            _context.PeopleAttributeDataTimeSeriesTag.Add(peopleAttributeDataTimeSeriesTag);

            await _context.SaveChangesAsync();

            return Ok(tag.TagId);
        }
    }
}