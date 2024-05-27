using System.Text.Json.Serialization;

namespace ignis.Domain.Model.PostgreSQL
{
    public class EvidenceActivity
    {
        public string EvidenceActivityId { get; set; }
        public string EvidenceId { get; set; }
        public string ActivityId { get; set; }
        public string? RelatedId { get; set; } = null;
        public string UserId { get; set; }
        public DateTime CreatedAt { get; set; }

        [JsonIgnore]
        public Evidence Evidence { get; set; }
        [JsonIgnore]
        public Activity Activity { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}