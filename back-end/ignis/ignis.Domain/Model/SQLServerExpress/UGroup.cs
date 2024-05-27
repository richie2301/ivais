using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class UGroup
{
    public int Id { get; set; }

    public long UGroupId { get; set; }

    public string? Name { get; set; }

    public string? InviteUrl { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }
}
