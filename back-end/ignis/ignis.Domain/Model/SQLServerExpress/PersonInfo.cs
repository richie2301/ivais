using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class PersonInfo
{
    public int PersonId { get; set; }

    public string? Name { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public string? EmployeeId { get; set; }

    public byte[]? CoverImage { get; set; }

    public string? Email { get; set; }

    public string? Company { get; set; }

    public string? Title { get; set; }

    public string? Note { get; set; }

    public string? FacilityCode { get; set; }

    public string? CardId { get; set; }

    public string? PersonGuid { get; set; }

    public string? FelicaCardId { get; set; }
}
