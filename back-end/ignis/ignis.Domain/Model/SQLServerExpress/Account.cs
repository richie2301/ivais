using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class Account
{
    public int AccountId { get; set; }

    public string? Name { get; set; }

    public string? Account1 { get; set; }

    public string Password { get; set; } = null!;

    public string? Email { get; set; }

    public byte? IsActivated { get; set; }

    public string? Region { get; set; }

    public string? Locale { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public int? RoleId { get; set; }

    public byte? IsDefault { get; set; }
}
