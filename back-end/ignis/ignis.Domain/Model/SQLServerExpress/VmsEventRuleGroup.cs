using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class VmsEventRuleGroup
{
    public int RuleId { get; set; }

    public int GroupId { get; set; }

    public int TagId { get; set; }

    public long Id { get; set; }
}
