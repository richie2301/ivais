namespace ignis.Domain.Model.Request
{
    public class AddMissionRequest
    {
        public string creatorUserId { get; set; }
        public string name { get; set; }
        public string status { get; set; }
    }
}