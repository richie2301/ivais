using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ignis.Domain.Model.PostgreSQL
{
    public class Person
    {
        public string PersonId { get; set; }
        [ForeignKey("Creator")]
        public string CreatorUserId { get; set; }
        public int PersonNumber { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Group { get; set; }
        public List<string> SubGroups { get; set; }
        public string Company { get; set; }
        public string Role { get; set; }
        public string? Notes { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public List<string> FaceUrls { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [JsonIgnore]
        public User Creator { get; set; }
    }
}