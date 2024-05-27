using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class Group
{
    public int GroupId { get; set; }

    public string? Name { get; set; }

    public string? Type { get; set; }

    public int? UGroupId { get; set; }

    public byte? UNotifyEnabled { get; set; }

    public string? UNotifyTemplate { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public byte? IsVisible { get; set; }

    public string? Color { get; set; }

    public int? PatternId { get; set; }

    public byte IsDeleted { get; set; }
}
