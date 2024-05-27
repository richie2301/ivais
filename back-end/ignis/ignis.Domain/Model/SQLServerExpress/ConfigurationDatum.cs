using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class ConfigurationDatum
{
    public string ConfigKey { get; set; } = null!;

    public byte[]? ConfigValue { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }
}
