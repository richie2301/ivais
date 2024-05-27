using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class Record
{
    public long RecordId { get; set; }

    public long? FaceId { get; set; }

    public int? CameraId { get; set; }

    public int? WorkstationId { get; set; }

    public DateTime? LogTime { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public int? PersonId { get; set; }

    public int? OcclusionType { get; set; }

    public int? LivenessResult { get; set; }

    public string? DebugData { get; set; }

    public double? Temperature { get; set; }

    public double? Similarity { get; set; }

    public string? BoundingBox { get; set; }

    public string? VmsCameraId { get; set; }

    public byte IsQualified { get; set; }
}
