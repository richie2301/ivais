namespace ignis.Domain.Model.Request
{
    public class AddBodyWornCameraRequest
    {
        public string creatorUserId { get; set; }
        public string? name { get; set; } = null;
        public string? location { get; set; } = null;
        public double? latitude { get; set; } = null;
        public double? longitude { get; set; } = null;
        public string nxServerId { get; set; }
        public string nxCameraId { get; set; }
    }
}