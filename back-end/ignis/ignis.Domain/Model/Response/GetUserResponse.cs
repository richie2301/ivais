namespace ignis.Domain.Model.Response
{
    public class GetUserResponse
    {
        public string userId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string type { get; set; }
        public string? phoneNumber { get; set; }
        public string? address { get; set; }
        public string? profilePicture { get; set; }
        public string status { get; set; }
        public DateTime? lastLogin { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }
}