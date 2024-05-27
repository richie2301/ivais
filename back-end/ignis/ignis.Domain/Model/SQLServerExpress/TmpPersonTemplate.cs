using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class TmpPersonTemplate
{
    public long TmpId { get; set; }

    public int? PersonId { get; set; }

    public byte[]? FaceFeature { get; set; }

    public int? FeatureType { get; set; }

    public int? FeatureSubType { get; set; }

    public DateTime CreatedTime { get; set; }
}
