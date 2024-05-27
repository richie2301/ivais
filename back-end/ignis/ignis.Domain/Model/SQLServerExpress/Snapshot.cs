using System;
using System.Collections.Generic;

namespace ignis.Domain.Model.SQLServerExpress;

public partial class Snapshot
{
    public long Id { get; set; }

    public int? PersonId { get; set; }

    public int? FaceId { get; set; }

    public byte[]? Snapshot1 { get; set; }

    public string? Source { get; set; }

    public byte? IsSelected { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastModified { get; set; }

    public byte IsSimilarFace { get; set; }

    public int? SimilarPersonId { get; set; }

    public byte EnrollType { get; set; }

    public string? UploadedFacesSnapshotIds { get; set; }

    public string? UploadedFacesInfo { get; set; }

    public byte[]? UploadedFacesCoverPhoto { get; set; }
}
