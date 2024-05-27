using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class GroupsPerson
{
    public int Id { get; set; }

    public int? GroupId { get; set; }

    public int? PersonId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public byte IsMaskEnroll { get; set; }
}
