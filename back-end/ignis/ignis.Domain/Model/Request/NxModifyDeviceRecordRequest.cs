using System;

namespace ignis.Domain.Model.Request
{
    public class Motion
    {
        public string type { get; set; }
    }
    
    public class Parameters
    {
        public string motionStream { get; set; }
        public List<string> userEnabledAnalyticsEngines { get; set; }
    }

    public class Task_
    {
        public int dayOfWeek { get; set; }
        public int endTime { get; set; }
        public int fps { get; set; }
        public string streamQuality { get; set; }
    }

    public class Schedule
    {
        public bool isEnabled { get; set; }
        public List<Task_> tasks { get; set; }
    }

    public class NxModifyDeviceRecordRequest
    {
        public Motion motion { get; set; }
        public string name { get; set; }
        public Parameters parameters { get; set; }
        public Schedule schedule { get; set; }
    }
}