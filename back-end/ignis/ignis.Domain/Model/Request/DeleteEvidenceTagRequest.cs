namespace ignis.Domain.Model.Request
{
    public class DeleteEvidenceTagRequest
    {
        public string creatorUserId { get; set; }
        public string tagId { get; set; }
        public string evidenceId { get; set; }
        public string? caseId { get; set; } = null;
    }
}