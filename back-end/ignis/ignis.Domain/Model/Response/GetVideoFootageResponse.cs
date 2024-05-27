namespace ignis.Domain.Model.Response
{
    public class GetVideoFootageTagResponse
    {
        public string tagId { get; set; }
        public string tagName { get; set; }
    }

    public class GetVideoFootageResponse
    {
        public string videoFootageId { get; set; }
        public string evidenceId { get; set; }
        public string name { get; set; }
        public string? location { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }
        public DateTime? recordingStartedAt { get; set; }
        public long? duration { get; set; }
        public string? originalVideoUrl { get; set; }
        public float analysisSpeedRatio { get; set; }
        public string? channel { get; set; }
        public DateTime? startedAt { get; set; }
        public DateTime? endedAt { get; set; }
        public bool? isCompressed { get; set; }
        public string status { get; set; }
        public string? description { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
        public string creatorUserName { get; set; }
        public List<GetVideoFootageTagResponse> tags { get; set; }
    }
}