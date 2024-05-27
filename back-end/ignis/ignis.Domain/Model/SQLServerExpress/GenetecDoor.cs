using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class GenetecDoor
{
    public int DoorId { get; set; }

    public string DoorGuid { get; set; } = null!;

    public string? DoorName { get; set; }

    public int? DoorState { get; set; }

    public int? IsDeleted { get; set; }
}
