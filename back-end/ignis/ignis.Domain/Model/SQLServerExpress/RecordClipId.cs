using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class RecordClipId
{
    public long RecordId { get; set; }

    public long ClipId { get; set; }
}
