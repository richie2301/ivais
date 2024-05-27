using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class BodyRecord
{
    public long RecordId { get; set; }

    public long? BodyId { get; set; }

    public int? CameraId { get; set; }

    public string? VmsCameraId { get; set; }

    public int? WorkstationId { get; set; }

    public DateTime? LogTime { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public double? Similarity { get; set; }

    public double? Confidence { get; set; }

    public int? BoundingBoxLeft { get; set; }

    public int? BoundingBoxTop { get; set; }

    public int? BoundingBoxRight { get; set; }

    public int? BoundingBoxBottom { get; set; }

    public string? DebugInfo { get; set; }

    public long FrameTime { get; set; }

    public DateTime EndTime { get; set; }

    public byte IsDeleted { get; set; }
}
