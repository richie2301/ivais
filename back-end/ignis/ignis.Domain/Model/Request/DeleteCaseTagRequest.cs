namespace ignis.Domain.Model.Request
{
    public class DeleteCaseTagRequest
    {
        public string creatorUserId { get; set; }
        public string tagId { get; set; }
        public string caseId { get; set; }
    }
}