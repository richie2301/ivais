namespace ignis.Domain.Model.Request
{
    public class UpdateEndedAtVideoFootageRequest
    {
        public string videoFootageId { get; set; }
        public DateTime endedAt { get; set; }
    }
}