using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class RecordTemplate
{
    public long RecordId { get; set; }

    public int FeatureType { get; set; }

    public int CameraId { get; set; }

    public DateTime LogTime { get; set; }

    public byte[] FaceFeature { get; set; } = null!;

    public int? WorkstationId { get; set; }
}
