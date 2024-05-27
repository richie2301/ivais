namespace ignis.Domain.Model.Response
{
    public class Result
    {
        public int cameraId { get; set; }
        public int workstationId { get; set; }
        public string name { get; set; }
        public string location { get; set; }
        public string rtspUrl { get; set; }
        public string status { get; set; }
        public bool isActive { get; set; }
    }

    public class FaceMeListCameraVmsResponse
    {
        public int totalSize { get; set; }
        public List<Result> results { get; set; }
    }
}