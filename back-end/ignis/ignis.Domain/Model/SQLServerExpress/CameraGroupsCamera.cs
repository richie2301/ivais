using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class CameraGroupsCamera
{
    public int Id { get; set; }

    public int? CameraGroupId { get; set; }

    public int? CameraId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }
}
