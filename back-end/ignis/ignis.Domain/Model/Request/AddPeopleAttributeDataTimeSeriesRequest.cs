using ignis.Domain.Model.Response;

namespace ignis.Domain.Model.Request
{
    public class AddPeopleAttributeDataTimeSeriesRequest : FaceMeSecurityGetPeopleAttributeDataResponse
    {
        public DateTime peopleAttributeDataTimestamp { get; set; }
        public string documentId { get; set; }
        public string? tag { get; set; } = null;
    }
}