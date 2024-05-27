using Microsoft.AspNetCore.Http;

namespace ignis.Domain.Model.Request
{
    public class AddVideoRequest
    {
        public string createdUserId { get; set; }
        public string? videoName { get; set; }
        public string location { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }
        public IFormFile videoFile { get; set; }
    }
}