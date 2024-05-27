using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class IoDevice
{
    public int DeviceId { get; set; }

    public int ModuleId { get; set; }

    public string Name { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string? Account { get; set; }

    public string? Password { get; set; }

    public int Status { get; set; }

    public short? ParityBits { get; set; }

    public short? DataBitLength { get; set; }

    public short? CardType { get; set; }
}
