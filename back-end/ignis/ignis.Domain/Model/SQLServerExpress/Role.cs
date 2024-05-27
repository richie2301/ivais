using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class Role
{
    public int RoleId { get; set; }

    public string? Name { get; set; }

    public string Type { get; set; } = null!;

    public string? Note { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public int? CameraGroupId { get; set; }
}
