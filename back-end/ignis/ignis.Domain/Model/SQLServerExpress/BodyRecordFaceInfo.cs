using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class BodyRecordFaceInfo
{
    public long Id { get; set; }

    public long? RecordId { get; set; }

    public long? FaceId { get; set; }

    public long? FaceRecordId { get; set; }

    public byte[]? FaceFeature { get; set; }

    public int? FaceFeatureSize { get; set; }

    public int? FaceFeatureType { get; set; }

    public int? FaceFeatureSubType { get; set; }
}
