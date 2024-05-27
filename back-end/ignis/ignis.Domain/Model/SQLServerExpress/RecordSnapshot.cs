using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class RecordSnapshot
{
    public long RecordId { get; set; }

    public byte[]? Snapshot { get; set; }
}
