using System.Text.Json.Serialization;

namespace ignis.Domain.Model.PostgreSQL
{
    public class CaseActivity
    {
        public string CaseActivityId { get; set; }
        public string CaseId { get; set; }
        public string ActivityId { get; set; }
        public string? RelatedId { get; set; } = null;
        public string? RelatedData { get; set; } = null;
        public string UserId { get; set; }
        public DateTime CreatedAt { get; set; }

        [JsonIgnore]
        public Case Case { get; set; }
        [JsonIgnore]
        public Activity Activity { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}