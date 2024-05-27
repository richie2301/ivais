using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class ClipInfo
{
    public long ClipId { get; set; }

    public int CentralId { get; set; }

    public int CameraId { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public int Duration { get; set; }

    public string StoragePath { get; set; } = null!;

    public string ClipPath { get; set; } = null!;

    public long ClipSize { get; set; }

    public int Category { get; set; }
}
