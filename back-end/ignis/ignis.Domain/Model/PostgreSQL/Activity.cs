namespace ignis.Domain.Model.PostgreSQL
{
    public class Activity
    {
        public string ActivityId { get; set; }
        public string Type { get; set; }
        public string Action { get; set; }
        public string Description { get; set; }

        public List<EvidenceActivity> EvidenceActivities { get; set; }
        public List<CaseActivity> CaseActivities { get; set; }
    }
}