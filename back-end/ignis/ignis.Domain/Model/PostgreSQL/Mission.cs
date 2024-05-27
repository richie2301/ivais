using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ignis.Domain.Model.PostgreSQL
{
    public class Mission
    {
        public string MissionId { get; set; }
        [ForeignKey("Creator")]
        public string CreatorUserId { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [JsonIgnore]
        public User Creator { get; set; }
        public List<Evidence> Evidences { get; set; }
        public List<Tag> Tags { get; set; }
    }
}