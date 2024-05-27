namespace ignis.Domain.Model.Request
{
    public class UpdateIsCompressedVideoFootageRequest
    {
        public string videoFootageId { get; set; }
        public bool? isCompressed { get; set; }
    }
}