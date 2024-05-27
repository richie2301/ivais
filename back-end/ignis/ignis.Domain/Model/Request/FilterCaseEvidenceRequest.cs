namespace ignis.Domain.Model.Request
{
    public class FilterCaseEvidenceRequest
    {
        public string caseId { get; set; }
        public string userId { get; set; }
        public long? startTime { get; set; } = null;
        public long? endTime { get; set; } = null;
        public List<double> personNumber { get; set; } = new List<double>();
        public List<string> generalAttribute { get; set; } = new List<string>();
        public List<string> colorAttribute { get; set; } = new List<string>();
        public List<string> tagId { get; set; } = new List<string>();
    }
}