namespace ignis.Domain.Model.Request
{
    public class UpdateStartedAtVideoFootageRequest
    {
        public string videoFootageId { get; set; }
        public DateTime startedAt { get; set; }
    }
}