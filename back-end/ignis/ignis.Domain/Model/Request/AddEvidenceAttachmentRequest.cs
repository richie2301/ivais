using Microsoft.AspNetCore.Http;

namespace ignis.Domain.Model.Request
{
    public class AddEvidenceAttachmentRequest
    {
        public string attachmentName { get; set; }
        public string documentId { get; set; }
        public IFormFile attachment { get; set; }
        public string? contentType { get; set; } = null;
    }
}