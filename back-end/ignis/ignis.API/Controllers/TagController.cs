using ignis.Domain.Model.PostgreSQL;
using ignis.Domain.Model.Request;
using ignis.Domain.Model.Response;
using Microsoft.AspNetCore.Mvc;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ILogger<TagController> _logger;
        private readonly DataContext _context;

        public TagController(ILogger<TagController> logger, DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpPost("add")]
        public async Task<ActionResult<Tag>> AddTag(AddTagRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            if (_context.Tag.Any(t => t.Name == request.name))
            {
                return BadRequest("Tag already exists.");
            }

            User? creator = await _context.User.FindAsync(request.creatorUserId);

            if (creator == null)
            {
                return BadRequest("User not found.");
            }

            Tag tag = new Tag
            {
                TagId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                Name = request.name,
                CreatedAt = dateTime,
                UpdatedAt = dateTime,
                Creator = creator
            };

            _context.Tag.Add(tag);

            await _context.SaveChangesAsync();

            return tag;
        }

        [HttpGet("list")]
        public async Task<ActionResult> GetTagList()
        {
            return Ok(await _context.Tag
                .Select(t => new GetTagListResponse
                {
                    tagId = t.TagId,
                    name = t.Name
                })
                .ToListAsync());
        }
    }
}