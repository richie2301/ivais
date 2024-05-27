using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class VmsEventRuleCamera
{
    public int RuleId { get; set; }

    public int CameraId { get; set; }

    public long Id { get; set; }
}
