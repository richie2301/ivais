using Microsoft.AspNetCore.Http;

namespace ignis.Domain.Model.Request
{
    public class AddVideoFootageRequest
    {
        public string creatorUserId { get; set; }
        public string? evidenceSourceId { get; set; } = null;
        public string? name { get; set; } = null;
        public string? location { get; set; } = null;
        public double? latitude { get; set; } = null;
        public double? longitude { get; set; } = null;
        public DateTime? recordingStartedAt { get; set; } = null;
        public string? description { get; set; } = null;
        public IFormFile? file { get; set; } = null;
    }
}