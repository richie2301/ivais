using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class BodyParInfo
{
    public long Id { get; set; }

    public long RecordId { get; set; }

    public double AgeYoung { get; set; }

    public double AgeAdult { get; set; }

    public double GenderMale { get; set; }

    public double GenderFemale { get; set; }

    public double HairShort { get; set; }

    public double HairLong { get; set; }

    public double UpperLengthLong { get; set; }

    public double UpperLengthShort { get; set; }

    public double LowerLengthLong { get; set; }

    public double LowerLengthShort { get; set; }

    public double LowerTypePants { get; set; }

    public double LowerTypeSkirt { get; set; }

    public double AttachmentBag { get; set; }

    public double AttachmentHat { get; set; }

    public double AttachmentHelmet { get; set; }

    public double AttachmentBackBag { get; set; }
}
