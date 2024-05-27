namespace ignis.Domain.Model.Request
{
    //public class SaveForensicDataRequest
    //{
    //    public string forensicDataId { get; set; }
    //    public DateTime timestamp { get; set; }
    //    public double unixTimestamp { get; set; }
    //    public double frameNumber { get; set; }
    //    public double vehicle { get; set; }
    //    public double car { get; set; }
    //    public double bus { get; set; }
    //    public double truck { get; set; }
    //    public double van { get; set; }
    //    public double bike { get; set; }
    //    public double unknown { get; set; }
    //}

    public class SaveForensicDataRequest
    {
        public string forensicDataId { get; set; }
        public double unixTimestamp { get; set; }
    }
}