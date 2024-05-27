namespace ignis.Domain.Model.Request
{
    public class UpdateIsCheckingBodyWornCameraRequest
    {
        public string bodyWornCameraId { get; set; }
        public bool isChecking { get; set; }
        public long? lastCheckedAt { get; set; }
    }
}