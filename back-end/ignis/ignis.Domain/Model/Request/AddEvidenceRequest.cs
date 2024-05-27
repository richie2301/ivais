namespace ignis.Domain.Model.Request
{
    public class AddEvidenceRequest
    {
        public string creatorUserId { get; set; }
        public string evidenceSourceId { get; set; }
        public string evidenceDocumentId { get; set; }
        public string type { get; set; }
    }
}