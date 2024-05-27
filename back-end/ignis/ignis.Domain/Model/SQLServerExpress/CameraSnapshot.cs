using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class CameraSnapshot
{
    public int CameraId { get; set; }

    public byte[]? Snapshot { get; set; }

    public DateTime? SnapshotTime { get; set; }
}
