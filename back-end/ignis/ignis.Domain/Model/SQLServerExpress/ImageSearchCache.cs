using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class ImageSearchCache
{
    public long SearchId { get; set; }

    public string Token { get; set; } = null!;

    public byte[] Image { get; set; } = null!;

    public byte[] FaceFeature { get; set; } = null!;

    public DateTime ExpiryTime { get; set; }

    public DateTime CreatedTime { get; set; }

    public byte[]? VhFeature { get; set; }
}
