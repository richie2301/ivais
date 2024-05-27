namespace ignis.Domain.Model.Response
{
    public class GetPersonListResponse
    {
        public string personId { get; set; }
        public string createdUserId { get; set; }
        public int personNumber { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string group { get; set; }
        public List<string> subGroups { get; set; }
        public string company { get; set; }
        public string role { get; set; }
        public string? notes { get; set; }
        public string? profilePictureUrl { get; set; }
        public List<string> faceUrls { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }
}