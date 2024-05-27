namespace ignis.Domain.Model.Response
{
    public class Device
    {
        public string id { get; set; }
    }

    public class NxSearchDeviceResponse
    {
        public List<Device> devices { get; set; }
    }
}