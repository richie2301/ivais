namespace ignis.Domain.Model.Request
{
    public class UpdateVideoFootageRequest
    {
        public string videoFootageId { get; set; }
        public string name { get; set; }
        public string? location { get; set; } = null;
        public double? latitude { get; set; } = null;
        public double? longitude { get; set; } = null;
    }
}