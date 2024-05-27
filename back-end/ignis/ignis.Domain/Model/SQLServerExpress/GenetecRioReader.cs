using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class GenetecRioReader
{
    public int ReaderId { get; set; }

    public int DoorId { get; set; }

    public string ReaderGuid { get; set; } = null!;

    public string? ReaderName { get; set; }

    public string? ReaderChannel { get; set; }

    public string? ReaderInterface { get; set; }

    public string? ReaderIndex { get; set; }

    public string? ReaderUniqueId { get; set; }

    public int? ReaderState { get; set; }

    public int? DoorSide { get; set; }

    public int? IsDeleted { get; set; }
}
