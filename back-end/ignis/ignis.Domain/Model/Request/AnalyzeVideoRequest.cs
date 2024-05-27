using Microsoft.AspNetCore.Http;

namespace ignis.Domain.Model.Request
{
    public class AnalyzeVideoRequest
    {
        public string createdUserId { get; set; }
        public string caseName { get; set; }
        public List<IFormFile>? faceFiles { get; set; }
        public List<string?>? faceNames { get; set; }
        public string? teamName { get; set; }
        public List<string>? teamMemberUserId { get; set; }
        public string? videoName { get; set; }
        public double latitude { get; set; }
        public double longitude { get; set; }
        public IFormFile videoFile { get; set; }
    }
}