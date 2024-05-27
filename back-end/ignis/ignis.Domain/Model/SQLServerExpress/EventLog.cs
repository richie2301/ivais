using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class EventLog
{
    public int LogId { get; set; }

    public DateTime LogTime { get; set; }

    public byte LogLevel { get; set; }

    public string Category { get; set; } = null!;

    public string? Source { get; set; }

    public string? Description { get; set; }

    public string? Data { get; set; }

    public byte[]? ExtraData { get; set; }
}
