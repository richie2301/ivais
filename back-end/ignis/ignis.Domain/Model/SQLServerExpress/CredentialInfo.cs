using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class CredentialInfo
{
    public int PersonId { get; set; }

    public string CredentialGuid { get; set; } = null!;

    public string? CardType { get; set; }

    public int? BitLength { get; set; }

    public string? RawData { get; set; }

    public DateTime? ExpirationDate { get; set; }

    public string? State { get; set; }
}
