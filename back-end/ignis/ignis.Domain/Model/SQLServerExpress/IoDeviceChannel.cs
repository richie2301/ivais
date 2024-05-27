using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class IoDeviceChannel
{
    public int DeviceId { get; set; }

    public int ChannelId { get; set; }

    public string Purpose { get; set; } = null!;

    public int? PulseTime { get; set; }

    public int? DefaultState { get; set; }

    public string? NativeInfo { get; set; }

    public DateTime? LastTriggerTime { get; set; }

    public string TriggerTime { get; set; } = null!;

    public byte SpecificTime { get; set; }

    public byte SpecificGroup { get; set; }
}
