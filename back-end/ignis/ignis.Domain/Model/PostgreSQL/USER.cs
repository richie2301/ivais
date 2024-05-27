namespace ignis.Domain.Model.PostgreSQL
{
    public class User
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string VerificationToken { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTime? ResetTokenExpired { get; set; }
        public string Type { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public string Status { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public List<Mission> Missions { get; set; }
        public List<Evidence> Evidences { get; set; }
        public List<Person> People { get; set; }
        public List<Tag> Tags { get; set; }
        public List<EvidenceAnalytic> EvidenceAnalytics { get; set; }
        public List<EvidenceActivity> EvidenceActivities { get; set; }
        public List<CaseActivity> CaseActivities { get; set; }
    }
}