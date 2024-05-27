using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class GenetecReaderCamera
{
    public int Id { get; set; }

    public int CameraId { get; set; }

    public int ReaderId { get; set; }

    public int? IsDeleted { get; set; }

    public string? CameraGuid { get; set; }
}
