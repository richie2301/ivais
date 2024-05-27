using Microsoft.AspNetCore.Http;

namespace ignis.Domain.Model.Request
{
    public class AddPersonRequest
    {
        public string creatorUserId { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string group { get; set; }
        //public List<string> subGroups { get; set; }
        public string company { get; set; }
        public string role { get; set; }
        public string? notes { get; set; }
        public IFormFile? profilePictureFile { get; set; }
        public List<IFormFile> faceFiles { get; set; }
    }
}