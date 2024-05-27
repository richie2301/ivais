namespace ignis.Domain.Model.Response
{
    public class FaceMeListWorkstationsAndCamerasCameraResponse
    {
        public long cameraId { get; set; }
        public string? vmsCameraId { get; set; }
        public long workstationId { get; set; }
        public string name { get; set; }
        public string location { get; set; }
        public string note { get; set; }
        public bool isMonitoring { get; set; }
    }

    public class FaceMeListWorkstationsAndCamerasResponse
    {
        public long workstationId { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public long totalCamera { get; set; }
        public long activeCamera { get; set; }
        public bool isAlive { get; set; }
        public int status { get; set; }
        public bool isVersionTooOld { get; set; }
        public bool? isBackupEnabled { get; set; }
        public long? backupPrimaryId { get; set; }
        public string? backupPrimaryName { get; set; }
        public long conflictCamera { get; set; }
        public List<FaceMeListWorkstationsAndCamerasCameraResponse> cameras { get; set; }
    }
}