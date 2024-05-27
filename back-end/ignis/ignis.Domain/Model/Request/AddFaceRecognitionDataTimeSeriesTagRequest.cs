namespace ignis.Domain.Model.Request
{
    public class AddFaceRecognitionDataTimeSeriesTagRequest
    {
        public string creatorUserId { get; set; }
        public string tagName { get; set; }
        public long faceRecognitionDataUnixTimestamp { get; set; }
        public string documentId { get; set; }
    }
}