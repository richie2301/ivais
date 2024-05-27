using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ignis.Domain.Model.PostgreSQL
{
    public class Evidence
    {
        public string EvidenceId { get; set; }
        [ForeignKey("Creator")]
        public string CreatorUserId { get; set; }
        public string EvidenceSourceId { get; set; }
        public string EvidenceDocumentId { get; set; }
        public string Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [JsonIgnore]
        public User Creator { get; set; }
        public EvidenceSource EvidenceSource { get; set; }
        [JsonIgnore]
        public List<Mission> Missions { get; set; }
        public List<Tag> Tags { get; set; }
        public List<EvidenceAnalytic> EvidenceAnalytics { get; set; }
        public List<EvidenceActivity> EvidenceActivities { get; set; }
    }
}