using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class WorkstationCentral
{
    public int WorkstationId { get; set; }

    public int CentralId { get; set; }

    public string? UsedIp { get; set; }

    public DateTime? LastModified { get; set; }
}
