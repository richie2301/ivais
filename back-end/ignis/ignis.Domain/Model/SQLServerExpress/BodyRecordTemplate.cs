using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class BodyRecordTemplate
{
    public long RecordId { get; set; }

    public byte[]? BodyFeature { get; set; }

    public int? BodyFeatureSize { get; set; }

    public int? BodyFeatureType { get; set; }

    public int? BodyFeatureSubType { get; set; }
}
