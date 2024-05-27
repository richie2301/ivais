namespace ignis.Domain.Model.Request
{
    public class CreateCaseRequest
    {
        public string? caseId { get; set; } = null;
        public string creatorUserId { get; set; }
        public string title { get; set; }
        public string? objective { get; set; } = null;
        public List<string> collaboratorUserId { get; set; } = new List<string>();
        public long? startTime { get; set; } = null;
        public long? endTime { get; set; } = null;
        public List<double> personNumber { get; set; } = new List<double>();
        public List<string> generalAttribute { get; set; } = new List<string>();
        public List<string> colorAttribute { get; set; } = new List<string>();
        public List<string> tagId { get; set; } = new List<string>();
    }
}