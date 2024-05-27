using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class VisitorSummary
{
    public DateTime SummarizedDate { get; set; }

    public int PersonId { get; set; }

    public int? GroupId { get; set; }

    public int VisitCount { get; set; }

    public int? OcclusionType { get; set; }
}
