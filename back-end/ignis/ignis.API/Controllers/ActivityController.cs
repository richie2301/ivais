using ignis.Domain.Model.PostgreSQL;
using Microsoft.AspNetCore.Mvc;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivityController : ControllerBase
    {
        private readonly ILogger<ActivityController> _logger;
        private readonly DataContext _context;

        public ActivityController(ILogger<ActivityController> logger, DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("createdefault")]
        public async Task<ActionResult> CreateDefaultActivity()
        {
            Activity? activity = new Activity();

            // EVIDENCE: ADD VIDEO
            activity = await _context.Activity
                .Where(a => a.Type == "EVIDENCE" && a.Action == "ADD VIDEO")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "EVIDENCE",
                    Action = "ADD VIDEO",
                    Description = "Added video"
                };

                _context.Activity.Add(activity);
            }

            // EVIDENCE: ANALYZE VIDEO STARTED
            activity = await _context.Activity
                .Where(a => a.Type == "EVIDENCE" && a.Action == "ANALYZE VIDEO STARTED")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "EVIDENCE",
                    Action = "ANALYZE VIDEO STARTED",
                    Description = "Analyze video started"
                };

                _context.Activity.Add(activity);
            }

            // EVIDENCE: ANALYZE VIDEO COMPLETED
            activity = await _context.Activity
                .Where(a => a.Type == "EVIDENCE" && a.Action == "ANALYZE VIDEO COMPLETED")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "EVIDENCE",
                    Action = "ANALYZE VIDEO COMPLETED",
                    Description = "Analyze video completed"
                };

                _context.Activity.Add(activity);
            }

            // EVIDENCE: ADD NOTES
            activity = await _context.Activity
                .Where(a => a.Type == "EVIDENCE" && a.Action == "ADD NOTES")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "EVIDENCE",
                    Action = "ADD NOTES",
                    Description = "Added notes"
                };

                _context.Activity.Add(activity);
            }

            // EVIDENCE: ADD TAG
            activity = await _context.Activity
                .Where(a => a.Type == "EVIDENCE" && a.Action == "ADD TAG")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "EVIDENCE",
                    Action = "ADD TAG",
                    Description = "Added tag"
                };

                _context.Activity.Add(activity);
            }

            // EVIDENCE: DELETE TAG
            activity = await _context.Activity
                .Where(a => a.Type == "EVIDENCE" && a.Action == "DELETE TAG")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "EVIDENCE",
                    Action = "DELETE TAG",
                    Description = "Deleted tag"
                };

                _context.Activity.Add(activity);
            }

            // CASE: DRAFT
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "DRAFT")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "DRAFT",
                    Description = "Drafted case"
                };

                _context.Activity.Add(activity);
            }

            // CASE: CREATE
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "CREATE")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "CREATE",
                    Description = "Created case"
                };

                _context.Activity.Add(activity);
            }

            // CASE: CLOSE
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "CLOSE")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "CLOSE",
                    Description = "Closed case"
                };

                _context.Activity.Add(activity);
            }

            // CASE: DELETE
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "DELETE")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "DELETE",
                    Description = "Deleted case"
                };

                _context.Activity.Add(activity);
            }

            // CASE: ADD COLLABORATOR
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "ADD COLLABORATOR")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "ADD COLLABORATOR",
                    Description = "Added collaborator"
                };

                _context.Activity.Add(activity);
            }

            // CASE: CHANGE TITLE
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "CHANGE TITLE")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "CHANGE TITLE",
                    Description = "Changed title"
                };

                _context.Activity.Add(activity);
            }

            // CASE: CHANGE OBJECTIVE
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "CHANGE OBJECTIVE")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "CHANGE OBJECTIVE",
                    Description = "Changed objective"
                };

                _context.Activity.Add(activity);
            }

            // CASE: ADD EXECUTIVE SUMMARY
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "ADD EXECUTIVE SUMMARY")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "ADD EXECUTIVE SUMMARY",
                    Description = "Added executive summary"
                };

                _context.Activity.Add(activity);
            }

            // CASE: CHANGE EXECUTIVE SUMMARY
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "CHANGE EXECUTIVE SUMMARY")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "CHANGE EXECUTIVE SUMMARY",
                    Description = "Changed executive summary"
                };

                _context.Activity.Add(activity);
            }

            // CASE: ADD CONCLUSION
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "ADD CONCLUSION")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "ADD CONCLUSION",
                    Description = "Added conclusion"
                };

                _context.Activity.Add(activity);
            }

            // CASE: CHANGE CONCLUSION
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "CHANGE CONCLUSION")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "CHANGE CONCLUSION",
                    Description = "Changed conclusion"
                };

                _context.Activity.Add(activity);
            }

            // CASE: NEW EVIDENCE
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "NEW EVIDENCE")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "NEW EVIDENCE",
                    Description = "New evidence detected"
                };

                _context.Activity.Add(activity);
            }

            // CASE: LINK EVIDENCE
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "LINK EVIDENCE")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "LINK EVIDENCE",
                    Description = "Linked evidence"
                };

                _context.Activity.Add(activity);
            }

            // CASE: UNLINK EVIDENCE
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "UNLINK EVIDENCE")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "UNLINK EVIDENCE",
                    Description = "Unlinked evidence"
                };

                _context.Activity.Add(activity);
            }

            // CASE: ADD NOTES
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "ADD NOTES")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "ADD NOTES",
                    Description = "Added notes"
                };

                _context.Activity.Add(activity);
            }

            // CASE: ADD TAG
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "ADD TAG")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "ADD TAG",
                    Description = "Added tag"
                };

                _context.Activity.Add(activity);
            }

            // CASE: DELETE TAG
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "DELETE TAG")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "DELETE TAG",
                    Description = "Deleted tag"
                };

                _context.Activity.Add(activity);
            }

            // CASE: ADD EVIDENCE TAG
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "ADD EVIDENCE TAG")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "ADD EVIDENCE TAG",
                    Description = "Added evidence tag"
                };

                _context.Activity.Add(activity);
            }

            // CASE: DELETE EVIDENCE TAG
            activity = await _context.Activity
                .Where(a => a.Type == "CASE" && a.Action == "DELETE EVIDENCE TAG")
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                activity = new Activity
                {
                    ActivityId = string.Join("", Guid.NewGuid().ToString().ToArray()),
                    Type = "CASE",
                    Action = "DELETE EVIDENCE TAG",
                    Description = "Deleted evidence tag"
                };

                _context.Activity.Add(activity);
            }

            await _context.SaveChangesAsync();

            return Ok("Default activity registered.");
        }
    }
}