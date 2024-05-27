using ignis.Domain.Model.Response;
using ignis.Domain.Model.SQLServerExpress;
using Microsoft.AspNetCore.Mvc;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FaceMeSecurityController : ControllerBase
    {
        private readonly ILogger<FaceMeSecurityController> _logger;
        private readonly FaceMeSecurityContext _faceMeSecurityContext;

        public FaceMeSecurityController(ILogger<FaceMeSecurityController> logger, FaceMeSecurityContext faceMeSecurityContext)
        {
            _logger = logger;
            _faceMeSecurityContext = faceMeSecurityContext;
        }

        [HttpGet("peopleattributedata")]
        public async Task<ActionResult> GetPeopleAttributeData(long startDate, long endDate, int? cameraId = null)
        {
            List<FaceMeSecurityGetPeopleAttributeDataResponse> faceMeSecurityGetPeopleAttributeDataResponses = new List<FaceMeSecurityGetPeopleAttributeDataResponse>();

            List<BodyRecord> bodyRecords = await _faceMeSecurityContext.BodyRecords
                .Where(br => br.LogTime >= DateTimeOffset.FromUnixTimeMilliseconds(startDate).LocalDateTime)
                .Where(br => br.LogTime <= DateTimeOffset.FromUnixTimeMilliseconds(endDate).LocalDateTime)
                .OrderBy(br => br.LogTime)
                .ToListAsync();

            if (cameraId != null)
            {
                bodyRecords = bodyRecords.FindAll(br => br.CameraId == cameraId);
            }

            foreach (BodyRecord bodyRecord in bodyRecords)
            {
                BodyParInfo? bodyParInfo = await _faceMeSecurityContext.BodyParInfos
                    .Where(bpi => bpi.RecordId == bodyRecord.RecordId)
                    .FirstOrDefaultAsync();

                BodyColorInfo? upperBodyColorInfo = await _faceMeSecurityContext.BodyColorInfos
                    .Where(bci => bci.RecordId == bodyRecord.RecordId)
                    .Where(bci => bci.ColorType == 0)
                    .FirstOrDefaultAsync();

                BodyColorInfo? lowerBodyColorInfo = await _faceMeSecurityContext.BodyColorInfos
                    .Where(bci => bci.RecordId == bodyRecord.RecordId)
                    .Where(bci => bci.ColorType == 1)
                    .FirstOrDefaultAsync();

                faceMeSecurityGetPeopleAttributeDataResponses.Add(new FaceMeSecurityGetPeopleAttributeDataResponse
                {
                    unixTimestampStart = bodyRecord.LogTime != null ? new DateTimeOffset((DateTime)bodyRecord.LogTime, TimeZoneInfo.Local.GetUtcOffset(DateTime.Now)).ToUnixTimeMilliseconds() : -1,
                    unixTimestampEnd = new DateTimeOffset(bodyRecord.EndTime, TimeZoneInfo.Local.GetUtcOffset(DateTime.Now)).ToUnixTimeMilliseconds(),
                    personNumber = -1,
                    young = bodyParInfo != null ? bodyParInfo.AgeYoung : -1,
                    adult = bodyParInfo != null ? bodyParInfo.AgeAdult : -1,
                    male = bodyParInfo != null ? bodyParInfo.GenderMale : -1,
                    female = bodyParInfo != null ? bodyParInfo.GenderFemale : -1,
                    hairShort = bodyParInfo != null ? bodyParInfo.HairShort : -1,
                    hairLong = bodyParInfo != null ? bodyParInfo.HairLong : -1,
                    upperLengthLong = bodyParInfo != null ? bodyParInfo.UpperLengthLong : -1,
                    upperLengthShort = bodyParInfo != null ? bodyParInfo.UpperLengthShort : -1,
                    lowerLengthLong = bodyParInfo != null ? bodyParInfo.LowerLengthLong : -1,
                    lowerLengthShort = bodyParInfo != null ? bodyParInfo.LowerLengthShort : -1,
                    pants = bodyParInfo != null ? bodyParInfo.LowerTypePants : -1,
                    skirt = bodyParInfo != null ? bodyParInfo.LowerTypeSkirt : -1,
                    bag = bodyParInfo != null ? bodyParInfo.AttachmentBag : -1,
                    hat = bodyParInfo != null ? bodyParInfo.AttachmentHat : -1,
                    helmet = bodyParInfo != null ? bodyParInfo.AttachmentHelmet : -1,
                    backBag = bodyParInfo != null ? bodyParInfo.AttachmentBackBag : -1,
                    upperColorBlack = upperBodyColorInfo != null ? upperBodyColorInfo.Black : -1,
                    upperColorWhite = upperBodyColorInfo != null ? upperBodyColorInfo.White : -1,
                    upperColorRed = upperBodyColorInfo != null ? upperBodyColorInfo.Red : -1,
                    upperColorGreen = upperBodyColorInfo != null ? upperBodyColorInfo.Green : -1,
                    upperColorYellow = upperBodyColorInfo != null ? upperBodyColorInfo.Yellow : -1,
                    upperColorOrange = upperBodyColorInfo != null ? upperBodyColorInfo.Orange : -1,
                    upperColorPurple = upperBodyColorInfo != null ? upperBodyColorInfo.Purple : -1,
                    upperColorPink = upperBodyColorInfo != null ? upperBodyColorInfo.Pink : -1,
                    upperColorBlue = upperBodyColorInfo != null ? upperBodyColorInfo.Blue : -1,
                    upperColorGray = upperBodyColorInfo != null ? upperBodyColorInfo.Gray : -1,
                    lowerColorBlack = lowerBodyColorInfo != null ? lowerBodyColorInfo.Black : -1,
                    lowerColorWhite = lowerBodyColorInfo != null ? lowerBodyColorInfo.White : -1,
                    lowerColorRed = lowerBodyColorInfo != null ? lowerBodyColorInfo.Red : -1,
                    lowerColorGreen = lowerBodyColorInfo != null ? lowerBodyColorInfo.Green : -1,
                    lowerColorYellow = lowerBodyColorInfo != null ? lowerBodyColorInfo.Yellow : -1,
                    lowerColorOrange = lowerBodyColorInfo != null ? lowerBodyColorInfo.Orange : -1,
                    lowerColorPurple = lowerBodyColorInfo != null ? lowerBodyColorInfo.Purple : -1,
                    lowerColorPink = lowerBodyColorInfo != null ? lowerBodyColorInfo.Pink : -1,
                    lowerColorBlue = lowerBodyColorInfo != null ? lowerBodyColorInfo.Blue : -1,
                    lowerColorGray = lowerBodyColorInfo != null ? lowerBodyColorInfo.Gray : -1,
                    snapshotUrl = bodyRecord.LastModified != null ? $"/image/br/{bodyRecord.RecordId}?ts={new DateTimeOffset((DateTime)bodyRecord.LastModified, TimeZoneInfo.Local.GetUtcOffset(DateTime.Now)).ToUnixTimeMilliseconds()}" : null
                });
            }

            return Ok(faceMeSecurityGetPeopleAttributeDataResponses);
        }
    }
}