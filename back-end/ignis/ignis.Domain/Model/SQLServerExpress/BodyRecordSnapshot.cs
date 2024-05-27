using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class BodyRecordSnapshot
{
    public long RecordId { get; set; }

    public byte[]? Snapshot { get; set; }
}
