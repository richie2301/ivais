using ignis.Domain.Model.PostgreSQL;
using ignis.Domain.Model.RavenDB;
using ignis.Domain.Model.Request;
using ignis.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents.Session;
using Serilog.Sinks.NewRelic.Logs.Sinks.NewRelicLogs;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private readonly ILogger<DeviceController> _logger;
        private readonly DataContext _context;

        public DeviceController(ILogger<DeviceController> logger, DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpPost("nxdevice/add")]
        public async Task<ActionResult> AddNxDevice(AddNxDeviceRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            EvidenceSource? evidenceSource = await _context.EvidenceSource.Where(es => es.Name == request.evidenceSource).FirstOrDefaultAsync();

            if (evidenceSource == null)
            {
                return NotFound("Evidence source not found.");
            }

            NxDevice nxDevice = new NxDevice()
            {
                NxDeviceId = $"{evidenceSource.Name.Replace(" ", "")}/{string.Join("", Guid.NewGuid().ToString().ToArray())}",
                CreatorUserId = await _context.User.Where(u => u.Type == "SYSTEM ADMIN").Select(u => u.UserId).FirstOrDefaultAsync(),
                EvidenceSourceId = evidenceSource.EvidenceSourceId,
                Name = request.name,
                Location = request.location,
                Latitude = request.latitude,
                Longitude = request.longitude,
                NxServerId = request.nxServerId,
                NxCameraId = request.nxCameraId,
                IsChecking = false,
                LastCheckedAt = dateTime.ToUnixTimestamp(),
                Status = "ACTIVE",
                CreatedAt = dateTime,
                UpdatedAt = dateTime
            };

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                session.Store(nxDevice, nxDevice.NxDeviceId);

                session.SaveChanges();
            }

            return Ok("Nx device added.");
        }

        [HttpPut("nxdevice/updateischecking")]
        public async Task<ActionResult> UpdateIsCheckingNxDevice(UpdateIsCheckingNxDeviceRequest request)
        {
            DateTime dateTime = DateTime.UtcNow;

            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                NxDevice? nxDevice = session.Load<NxDevice>(request.nxDeviceId);

                if (nxDevice == null)
                {
                    return NotFound("Nx device not found.");
                }

                nxDevice.IsChecking = request.isChecking;

                if (nxDevice.IsChecking == false)
                {
                    nxDevice.LastCheckedAt = request.lastCheckedAt;
                    session.Advanced.GetMetadataFor(nxDevice)["@refresh"] = DateTime.UtcNow.AddMinutes(1);
                }

                nxDevice.UpdatedAt = dateTime;

                session.SaveChanges();
            }

            return Ok("Update successful.");
        }

        [HttpGet("nxdevice/list")]
        public async Task<ActionResult> GetNxDeviceList(bool? isChecking = null)
        {
            List<NxDevice> nxDevices = new List<NxDevice>();
            
            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            {
                nxDevices = session.Query<NxDevice>().OrderByDescending(nd => nd.CreatedAt).ToList();
            }

            if (isChecking != null)
            {
                nxDevices = nxDevices.FindAll(nd => nd.IsChecking == isChecking);
            }

            return Ok(nxDevices);
        }
    }
}