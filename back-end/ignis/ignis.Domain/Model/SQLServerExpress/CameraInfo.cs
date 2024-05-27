using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class CameraInfo
{
    public int CameraId { get; set; }

    public int? WorkstationId { get; set; }

    public string? Name { get; set; }

    public string? Location { get; set; }

    public string? RtspUrl { get; set; }

    public string? Note { get; set; }

    public byte? IsActive { get; set; }

    public string? Status { get; set; }

    public byte IsDeleted { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public string? ExtraInfo { get; set; }

    public DateTime? LastActiveTime { get; set; }

    public int? LastActiveWid { get; set; }

    public byte IsActiveConflict { get; set; }

    public DateTime? SnapshotRequestTime { get; set; }

    public string? Account { get; set; }

    public string? Password { get; set; }

    public long Version { get; set; }

    public int? CentralId { get; set; }

    public string CameraType { get; set; } = null!;

    public int? RelayOnWorkstationId { get; set; }

    public int? RecordingServerId { get; set; }

    public string? RecordingServerName { get; set; }
}
