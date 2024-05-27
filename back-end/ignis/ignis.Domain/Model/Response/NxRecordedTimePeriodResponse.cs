namespace ignis.Domain.Model.Response
{
    public class Period
    {
        public string durationMs { get; set; }
        public string startTimeMs { get; set; }
    }

    public class Reply
    {
        public string guid { get; set; }
        public List<Period> periods { get; set; }
    }

    public class NxRecordedTimePeriodResponse
    {
        public List<Reply> reply { get; set; }
    }
}