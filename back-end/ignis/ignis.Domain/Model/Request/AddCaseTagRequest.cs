namespace ignis.Domain.Model.Request
{
    public class AddCaseTagRequest
    {
        public string creatorUserId { get; set; }
        public string tagName { get; set; }
        public string caseId { get; set; }
    }
}