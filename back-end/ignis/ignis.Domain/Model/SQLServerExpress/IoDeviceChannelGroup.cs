using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class IoDeviceChannelGroup
{
    public int Sn { get; set; }

    public int DeviceId { get; set; }

    public int ChannelId { get; set; }

    public int GroupId { get; set; }

    public int TagId { get; set; }
}
