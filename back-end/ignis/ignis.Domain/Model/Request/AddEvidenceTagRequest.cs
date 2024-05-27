namespace ignis.Domain.Model.Request
{
    public class AddEvidenceTagRequest
    {
        public string creatorUserId { get; set; }
        public string tagName { get; set; }
        public string evidenceId { get; set; }
        public string? caseId { get; set; } = null;
    }
}