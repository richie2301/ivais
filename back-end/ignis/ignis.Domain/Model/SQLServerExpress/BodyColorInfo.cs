using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class BodyColorInfo
{
    public long Id { get; set; }

    public long RecordId { get; set; }

    public int ColorType { get; set; }

    public double Black { get; set; }

    public double White { get; set; }

    public double Red { get; set; }

    public double Green { get; set; }

    public double Yellow { get; set; }

    public double Orange { get; set; }

    public double Purple { get; set; }

    public double Pink { get; set; }

    public double Blue { get; set; }

    public double Gray { get; set; }
}
