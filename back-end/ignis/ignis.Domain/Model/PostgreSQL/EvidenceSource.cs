using System.Text.Json.Serialization;

namespace ignis.Domain.Model.PostgreSQL
{
    public class EvidenceSource
    {
        public string EvidenceSourceId { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public List<Evidence> Evidences { get; set; }
    }
}