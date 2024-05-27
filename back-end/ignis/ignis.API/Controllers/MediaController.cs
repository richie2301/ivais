using Microsoft.AspNetCore.Mvc;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly ILogger<MediaController> _logger;
#if DEBUG
        static string Media_Root_Folder = "../../media";
#elif RELEASE
        static string Media_Root_Folder = "media";
#endif

        public MediaController(ILogger<MediaController> logger)
        {
            _logger = logger;
        }

        [HttpGet("video/{filePath}")]
        public IActionResult GetVideo(string filePath)
        {
            string videoFilePath = Path.Combine(Media_Root_Folder, filePath);
            
            if (!System.IO.File.Exists(videoFilePath))
            {
                return NotFound("Video file not found.");
            }

            return File(System.IO.File.OpenRead(videoFilePath), "video/webm");
        }

        [HttpGet("image/{filePath}")]
        public IActionResult GetImage(string filePath)
        {
            string imageFilePath = Path.Combine(Media_Root_Folder, filePath);

            if (!System.IO.File.Exists(imageFilePath))
            {
                return NotFound("Image file not found.");
            }

            return File(System.IO.File.OpenRead(imageFilePath), "image/jpeg");
        }
    }
}