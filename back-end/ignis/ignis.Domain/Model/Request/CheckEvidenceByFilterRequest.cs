namespace ignis.Domain.Model.Request
{
    public class CheckEvidenceByFilterRequest
    {
        public string evidenceId { get; set; }
        public long? startTime { get; set; } = null;
        public long? endTime { get; set; } = null;
        public List<double> personNumber { get; set; } = new List<double>();
        public List<string> generalAttribute { get; set; } = new List<string>();
        public List<string> colorAttribute { get; set; } = new List<string>();
        public List<string> tagId { get; set; } = new List<string>();
    }
}