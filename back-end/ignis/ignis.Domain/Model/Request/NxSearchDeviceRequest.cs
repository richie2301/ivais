namespace ignis.Domain.Model.Request
{
    public class Credentials
    {
        public string user { get; set; }
        public string password { get; set; }
    }

    public class Target
    {
        public string ip { get; set; }
    }
    
    public class NxSearchDeviceRequest
    {
        public string mode { get; set; }
        public Target target { get; set; }
    }

    public class NxSearchDeviceWithCredentialsRequest : NxSearchDeviceRequest
    {
        public Credentials credentials { get; set; }
    }
}