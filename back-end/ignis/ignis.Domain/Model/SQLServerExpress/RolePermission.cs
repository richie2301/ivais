using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class RolePermission
{
    public int RoleId { get; set; }

    public string Permission { get; set; } = null!;
}
