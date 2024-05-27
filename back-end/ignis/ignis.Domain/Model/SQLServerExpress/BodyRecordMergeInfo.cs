using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class BodyRecordMergeInfo
{
    public long Id { get; set; }

    public long RecordId { get; set; }

    public long FrameId { get; set; }

    public long PersonId { get; set; }

    public long OriginalPersonId { get; set; }
}
