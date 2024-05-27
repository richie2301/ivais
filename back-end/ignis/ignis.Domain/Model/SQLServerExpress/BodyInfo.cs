using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class BodyInfo
{
    public long BodyId { get; set; }

    public int? FaceId { get; set; }

    public byte[]? BodyFeature { get; set; }

    public int? FeatureSize { get; set; }

    public int? FeatureType { get; set; }

    public int? FeatureSubType { get; set; }

    public double Score { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }
}
