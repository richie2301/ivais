namespace ignis.Domain.Model.Response
{
    public class CreateCaseInfoPersonResponse
    {
        public string id { get; set; }
        public string name { get; set; }
        public string? profilePictureUrl { get; set; }
    }

    public class CreateCaseInfoResponse
    {
        public string caseId { get; set; }
        public string creatorName { get; set; }
        public string caseName { get; set; }
        public List<string> cameras { get; set; }
        public List<string> videos { get; set; }
        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }
        public List<CreateCaseInfoPersonResponse> persons { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }

    public class CreateCaseDataResponse
    {
        public string personId { get; set; }
        public string personName { get; set; }
        public string source { get; set; }
        public string sourceId { get; set; }
        public string? sourceType { get; set; }
        public string sourceName { get; set; }
        public string sourceLocation { get; set; }
        public double? sourceLatitude { get; set; }
        public double? sourceLongitude { get; set; }
        public DateTime timestamp { get; set; }
        public string? videoTimecode { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }
        public string? mask { get; set; }
        public string? clipVideoUrl { get; set; }
    }

    public class CreateCaseResponse
    {
        public CreateCaseInfoResponse info { get; set; }
        public List<CreateCaseDataResponse> data { get; set; }
    }
}