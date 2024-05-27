namespace ignis.Domain.Model.RavenDB
{
    public class NxDevice
    {
        public string NxDeviceId { get; set; }
        public string CreatorUserId { get; set; }
        public string EvidenceSourceId { get; set; }
        public string Name { get; set; }
        public string? Location { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string NxServerId { get; set; }
        public string NxCameraId { get; set; }
        public bool IsChecking { get; set; }
        public long? LastCheckedAt { get; set; }
        public string Status { get; set; } // ACTIVE, INACTIVE
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class NxDeviceRecordingData
    {
        public string? nxDeviceId { get; set; } = null;
        public DateTime? startedAt { get; set; } = null;
        public long? duration { get; set; } = null;
    }
}