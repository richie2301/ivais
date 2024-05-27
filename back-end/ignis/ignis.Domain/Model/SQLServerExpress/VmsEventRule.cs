using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class VmsEventRule
{
    public int RuleId { get; set; }

    public string Name { get; set; } = null!;

    public byte? Enabled { get; set; }

    public string TriggerTime { get; set; } = null!;

    public byte SpecificTime { get; set; }

    public byte SpecificGroup { get; set; }
}
