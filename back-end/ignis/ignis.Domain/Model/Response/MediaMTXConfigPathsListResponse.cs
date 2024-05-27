namespace ignis.Domain.Model.Response
{
    public class MediaMTXConfigPathsListItemResponse
    {
        public string name { get; set; }
        public string runOnInit { get; set; }
        public bool runOnInitRestart { get; set; }
    }

    public class MediaMTXConfigPathsListResponse
    {
        public int itemCount { get; set; }
        public int pageCount { get; set; }
        public List<MediaMTXConfigPathsListItemResponse> items { get; set; }
    }
}