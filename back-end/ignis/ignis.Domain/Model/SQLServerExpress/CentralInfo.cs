using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class CentralInfo
{
    public int CentralId { get; set; }

    public string? Ip { get; set; }

    public int? Port { get; set; }

    public string? DeviceId { get; set; }

    public string? VersionName { get; set; }

    public int? VersionCode { get; set; }

    public string? Status { get; set; }

    public DateTime? LastAlive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public string? Name { get; set; }

    public string? ExtraInfo { get; set; }

    public byte IsHide { get; set; }

    public string? AccessibleIp { get; set; }
}
