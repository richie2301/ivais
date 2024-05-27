namespace ignis.Domain.Model.Request
{
    public class AddPeopleAttributeDataTimeSeriesTagRequest
    {
        public string creatorUserId { get; set; }
        public string tagName { get; set; }
        public long peopleAttributeDataUnixTimestamp { get; set; }
        public string documentId { get; set; }
    }
}