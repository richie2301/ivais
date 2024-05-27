namespace ignis.Domain.Model.Response
{
    public class FaceMeListGroupResultResponse
    {
        public long groupId { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public int memberCount { get; set; }
        public string color { get; set; }
        public int patterId { get; set; }
    }

    public class FaceMeListGroupResponse
    {
        public int totalSize { get; set; }
        public List<FaceMeListGroupResultResponse> results { get; set; }
    }
}