namespace ignis.Domain.Model.Response
{
    public class GetCaseDraftResponse
    {
        public string caseId { get; set; }
        public string title { get; set; }
        public string? objective { get; set; }
        public List<string> collaboratorUserId { get; set; }
        public long? startTime { get; set; }
        public long? endTime { get; set; }
        public List<double> personNumber { get; set; }
        public List<string> generalAttribute { get; set; }
        public List<string> colorAttribute { get; set; }
        public List<string> tagId { get; set; }
    }
}