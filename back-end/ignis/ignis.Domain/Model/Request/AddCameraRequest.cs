namespace ignis.Domain.Model.Request
{
    public class AddCameraRequest
    {
        public string createdUserId { get; set; }
        public string cameraType { get; set; }
        public string cameraName { get; set; }
        public string location { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }
        public string cameraUrl { get; set; }
        public string? username { get; set; }
        public string? password { get; set; }
    }
}