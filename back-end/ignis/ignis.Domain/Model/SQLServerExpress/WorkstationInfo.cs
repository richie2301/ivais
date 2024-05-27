using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class WorkstationInfo
{
    public int WorkstationId { get; set; }

    public string? Name { get; set; }

    public string? DeviceId { get; set; }

    public DateTime? LastAlive { get; set; }

    public byte IsSignedIn { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public string? VersionName { get; set; }

    public int? VersionCode { get; set; }

    public string Type { get; set; } = null!;

    public int? BackupPrimaryId { get; set; }

    public byte? BackupEnabled { get; set; }

    public string? ExtraData { get; set; }

    public short Status { get; set; }

    public int Mode { get; set; }

    public string? PublicIp { get; set; }

    public string? IntranetIp { get; set; }

    public byte RelayEnabled { get; set; }

    public int? RelayPort { get; set; }
}
