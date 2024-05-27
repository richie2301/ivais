using Microsoft.AspNetCore.Http;

namespace ignis.Domain.Model.Request
{
    public class UpdateFileVideoFootageRequest
    {
        public string videoFootageId { get; set; }
        public long? duration { get; set; } = null;
        public IFormFile file { get; set; }
    }
}