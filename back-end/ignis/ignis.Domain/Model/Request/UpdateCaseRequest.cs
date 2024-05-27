namespace ignis.Domain.Model.Request
{
    public class UpdateCaseRequest
    {
        public string creatorUserId { get; set; }
        public string? title { get; set; } = null;
        public string? objective { get; set; } = null;
        public string? executiveSummary { get; set; } = null;
        public string? conclusion { get; set; } = null;
        public string caseId { get; set; }
    }
}