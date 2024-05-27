namespace ignis.Domain.Model.Response
{
    public class GetVideoFootageToAnalyzeResponse
    {
        public string videoFootageId { get; set; }
        public string? originalVideoUrl { get; set; }
        public float analysisSpeedRatio { get; set; }
    }
}