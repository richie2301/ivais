namespace ignis.Domain.Model.Request
{
    public class AddCaseCollaboratorRequest
    {
        public string creatorUserId { get; set; }
        public string collaboratorUserId { get; set; }
        public string caseId { get; set; }
    }
}