using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ignis.Domain.Model.PostgreSQL
{
    public class EvidenceAnalytic
    {
        public string EvidenceAnalyticId { get; set; }
        [ForeignKey("Creator")]
        public string CreatorUserId { get; set; }
        public string EvidenceId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Notes { get; set; }
        public int Level { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [JsonIgnore]
        public User Creator { get; set; }
        [JsonIgnore]
        public Evidence Evidence { get; set; }
    }
}