namespace ignis.Domain.Model.Response
{
    public class MediaMTXRTSPSessionsListItemResponse
    {
        public string state { get; set; }
        public string path { get; set; }
    }

    public class MediaMTXRTSPSessionsListResponse
    {
        public int itemCount { get; set; }
        public int pageCount { get; set; }
        public List<MediaMTXRTSPSessionsListItemResponse> items { get; set; }
    }
}