using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class BodySearchCache
{
    public long Id { get; set; }

    public long SearchId { get; set; }

    public string Token { get; set; } = null!;

    public byte[] Image { get; set; } = null!;

    public int? ImageType { get; set; }

    public byte[] ImageFeature { get; set; } = null!;

    public DateTime ExpiryTime { get; set; }

    public DateTime CreatedTime { get; set; }
}
