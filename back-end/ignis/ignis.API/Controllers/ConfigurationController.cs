using ignis.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Raven.Client.ServerWide.Operations;
using Raven.Client.ServerWide;
using Raven.Client.Exceptions.Documents.Subscriptions;
using ignis.Domain.Model.RavenDB;
using Raven.Client.Documents.Subscriptions;
using Raven.Client.Documents.Operations.Refresh;

namespace ignis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigurationController : ControllerBase
    {
        private readonly ILogger<ConfigurationController> _logger;
        private readonly DataContext _context;
        static string videoFootageToCompress_SubscriptionName = "VideoFootageToCompress_Subscription";
        static string videoFootageToAnalyze_SubscriptionName = "VideoFootageToAnalyze_Subscription";
        static string nxDeviceToGetRecording_SubscriptionName = "NxDeviceToGetRecording_Subscription";

        public ConfigurationController(ILogger<ConfigurationController> logger, DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("ravendb")]
        public async Task<ActionResult> RavenDBConfiguration()
        {
            DatabaseRecordWithEtag? databases = DocumentStoreHolder.Store.Maintenance.Server.Send(new GetDatabaseRecordOperation(DocumentStoreHolder.Store.Database));

            if (databases == null)
            {
                DocumentStoreHolder.Store.Maintenance.Server.Send(new CreateDatabaseOperation(new DatabaseRecord(DocumentStoreHolder.Store.Database)));
            }

            try
            {
                await DocumentStoreHolder.Store.Subscriptions.GetSubscriptionStateAsync(videoFootageToCompress_SubscriptionName);
            }
            catch (SubscriptionDoesNotExistException)
            {
                await DocumentStoreHolder.Store.Subscriptions.CreateAsync(new SubscriptionCreationOptions<VideoFootage>
                {
                    Name = videoFootageToCompress_SubscriptionName,
                    Filter = vf => vf.IsCompressed == false && vf.OriginalVideoUrl != null
                });
            }

            try
            {
                await DocumentStoreHolder.Store.Subscriptions.GetSubscriptionStateAsync(videoFootageToAnalyze_SubscriptionName);
            }
            catch (SubscriptionDoesNotExistException)
            {
                await DocumentStoreHolder.Store.Subscriptions.CreateAsync(new SubscriptionCreationOptions<VideoFootage>
                {
                    Name = videoFootageToAnalyze_SubscriptionName,
                    Filter = vf => vf.Status == "WAITING"
                });
            }

            try
            {
                await DocumentStoreHolder.Store.Subscriptions.GetSubscriptionStateAsync(nxDeviceToGetRecording_SubscriptionName);
            }
            catch (SubscriptionDoesNotExistException)
            {
                await DocumentStoreHolder.Store.Subscriptions.CreateAsync(new SubscriptionCreationOptions
                {
                    Name = nxDeviceToGetRecording_SubscriptionName,
                    Query = @"declare function predicate() { return this.IsChecking===false && !this['@metadata'].hasOwnProperty('@refresh') }
from 'NxDevices' as doc
where predicate.call(doc)"
                });
            }

            RefreshConfiguration refreshConfiguration = new RefreshConfiguration
            {
                Disabled = false,
                RefreshFrequencyInSec = 60
            };

            DocumentStoreHolder.Store.Maintenance.Send(new ConfigureRefreshOperation(refreshConfiguration));

            return Ok("Default RavenDB configuration registered.");
        }
    }
}