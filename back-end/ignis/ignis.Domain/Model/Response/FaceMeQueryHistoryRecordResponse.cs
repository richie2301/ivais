namespace ignis.Domain.Model.Response
{
    public class FaceMeQueryHistoryRecordResultVisitorResponse
    {
        public long personId { get; set; }
        public string? name { get; set; }
        public string image { get; set; }
    }

    public class FaceMeQueryHistoryRecordResultCameraResponse
    {
        public long cameraId { get; set; }
        public string vmsCameraId { get; set; }
        public string name { get; set; }
        public string location { get; set; }
        public string note { get; set; }
    }

    public class FaceMeQueryHistoryRecordResultGroupTagResponse
    {
        public int tagId { get; set; }
        public string name { get; set; }
        public long groupId { get; set; }
    }

    public class FaceMeQueryHistoryRecordResultGroupResponse
    {
        public long groupId { get; set; }
        public string type { get; set; }
        public string name { get; set; }
        public string color { get; set; }
        public int patternId { get; set; }
        public List<FaceMeQueryHistoryRecordResultGroupTagResponse> tags { get; set; }
    }

    public class FaceMeQueryHistoryRecordResultBoundingBoxResponse
    {
        public int left { get; set; }
        public int top { get; set; }
        public int right { get; set; }
        public int bottom { get; set; }
    }

    public class FaceMeQueryHistoryRecordResultResponse
    {
        public long recordId { get; set; }
        public string logTime { get; set; }
        public string snapshotUrl { get; set; }
        public string mask { get; set; }
        public float? temperature { get; set; }
        public float? temperatureThreshold { get; set; }
        public FaceMeQueryHistoryRecordResultVisitorResponse visitor { get; set; }
        public FaceMeQueryHistoryRecordResultCameraResponse camera { get; set; }
        public List<FaceMeQueryHistoryRecordResultGroupResponse> groups { get; set; }
        public FaceMeQueryHistoryRecordResultBoundingBoxResponse boundingBox { get; set; }
    }

    public class FaceMeQueryHistoryRecordResponse
    {
        public List<FaceMeQueryHistoryRecordResultResponse> results { get; set; }
        public long totalSize { get; set; }
    }
}