using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class GroupTag
{
    public int TagId { get; set; }

    public int GroupId { get; set; }

    public string Name { get; set; } = null!;

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }
}
