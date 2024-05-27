using Microsoft.AspNetCore.Http;

namespace ignis.Domain.Model.Request
{
    public class UpdateUserProfilePictureRequest
    {
        public string userId { get; set; }
        public IFormFile profilePictureFile { get; set; }
    }
}