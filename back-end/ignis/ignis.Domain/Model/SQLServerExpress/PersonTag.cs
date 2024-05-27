using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class PersonTag
{
    public int TagId { get; set; }

    public int PersonId { get; set; }
}
