using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class AccountToken
{
    public int TokenId { get; set; }

    public int? AccountId { get; set; }

    public string? Token { get; set; }

    public DateTime? ExpirationDate { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public string? SourceType { get; set; }

    public int? SourceId { get; set; }

    public int? RelatedId { get; set; }
}
