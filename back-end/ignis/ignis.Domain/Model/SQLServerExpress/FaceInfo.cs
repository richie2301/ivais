using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class FaceInfo
{
    public long FaceId { get; set; }

    public int? PersonId { get; set; }

    public byte[]? ExtraData { get; set; }

    public byte[]? FaceFeature { get; set; }

    public int? FeatureSize { get; set; }

    public int? FeatureType { get; set; }

    public int? FeatureSubType { get; set; }

    public double Score { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public int? Feature2Type { get; set; }

    public int? Feature2SubType { get; set; }

    public int? Feature2Size { get; set; }

    public byte[]? FaceFeature2 { get; set; }

    public byte IsDisabled { get; set; }

    public byte[]? VhFeature { get; set; }

    public int? VhFeatureSize { get; set; }

    public int? VhFeatureType { get; set; }

    public int? VhFeatureSubType { get; set; }

    public byte[]? VhFeature2 { get; set; }

    public int? VhFeature2Size { get; set; }

    public int? VhFeature2Type { get; set; }

    public int? VhFeature2SubType { get; set; }
}
