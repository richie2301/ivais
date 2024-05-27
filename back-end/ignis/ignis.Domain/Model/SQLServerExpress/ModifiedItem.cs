using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class ModifiedItem
{
    public long Id { get; set; }

    public short Action { get; set; }

    public short TableIndex { get; set; }

    public long ItemId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }
}
