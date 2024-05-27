namespace ignis.Domain.Model.Request
{
    public class AddEvidenceAnalyticRequest
    {
        public string creatorUserId { get; set; }
        public string evidenceId { get; set; }
        public long startTime { get; set; }
        public long endTime { get; set; }
        public string notes { get; set; }
        public int level { get; set; }
    }
}