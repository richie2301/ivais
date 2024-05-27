using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class NxServer
{
    public string ServerGuid { get; set; } = null!;

    public string? ServerAddress { get; set; }

    public int? PluginPort { get; set; }
}
