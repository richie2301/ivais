namespace ignis.Domain.Model.Request
{
    public class NxSaveEventRuleRequest
    {
        public string id { get; set; }
        public string eventType { get; set; }
        public List<string> eventResourceIds { get; set; }
        public string eventCondition { get; set; }
        public string eventState { get; set; }
        public string actionType { get; set; }
        public List<string> actionResourceIds { get; set; }
        public string actionParams { get; set; }
        public int aggregationPeriod { get; set; }
        public bool disabled { get; set; }
    }
}