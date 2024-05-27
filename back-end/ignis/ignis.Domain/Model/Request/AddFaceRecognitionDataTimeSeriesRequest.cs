namespace ignis.Domain.Model.Request
{
    public class AddFaceRecognitionDataTimeSeriesRequest
    {
        public DateTime faceRecognitionDataTimestamp { get; set; }
        public string documentId { get; set; }
        public long unixTimestamp { get; set; }
        public int personNumber { get; set; }
        public string mask { get; set; }
        public string? tag { get; set; } = null;
    }
}