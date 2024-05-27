using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class RecordingServer
{
    public long RecordingServerId { get; set; }

    public string? RecorderId { get; set; }

    public string? RecordingServerName { get; set; }

    public byte? IsDeleted { get; set; }
}
