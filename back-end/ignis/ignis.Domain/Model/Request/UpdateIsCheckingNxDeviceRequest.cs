namespace ignis.Domain.Model.Request
{
    public class UpdateIsCheckingNxDeviceRequest
    {
        public string nxDeviceId { get; set; }
        public bool isChecking { get; set; }
        public long? lastCheckedAt { get; set; }
    }
}