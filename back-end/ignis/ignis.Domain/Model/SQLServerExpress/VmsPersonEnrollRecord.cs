using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class VmsPersonEnrollRecord
{
    public int RecordId { get; set; }

    public string PersonGuid { get; set; } = null!;

    public string? PersonName { get; set; }

    public string? EnrollResult { get; set; }

    public DateTime? EnrollDate { get; set; }

    public string? Email { get; set; }
}
