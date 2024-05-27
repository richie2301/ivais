namespace ignis.Domain.Model.Request
{
    public class FaceMeImportPersonEnrollInformationRequest
    {
        public string email { get; set; }
        public string company { get; set; }
        public string title { get; set; }
        public string? note { get; set; }
    }
}