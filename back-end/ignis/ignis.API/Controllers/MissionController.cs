using ignis.Domain.Model.PostgreSQL;
using ignis.Domain.Model.Request;
using Microsoft.AspNetCore.Mvc;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MissionController : ControllerBase
    {
        private readonly ILogger<MissionController> _logger;
        private readonly DataContext _context;

        public MissionController(ILogger<MissionController> logger, DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpPost("add")]
        public async Task<ActionResult> AddMission(AddMissionRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            if (_context.Mission.Any(m => m.Name == request.name))
            {
                return BadRequest("Mission already exists.");
            }

            User? creator = await _context.User.FindAsync(request.creatorUserId);

            if (creator == null)
            {
                return BadRequest("User not found.");
            }

            Mission mission = new Mission()
            {
                MissionId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                Name = request.name,
                Status = request.status,
                CreatedAt = dateTime,
                UpdatedAt = dateTime,
                Creator = creator
            };

            _context.Mission.Add(mission);

            await _context.SaveChangesAsync();

            return Ok("Mission added.");
        }
    }
}