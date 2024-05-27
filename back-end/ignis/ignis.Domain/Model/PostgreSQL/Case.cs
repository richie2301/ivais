using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ignis.Domain.Model.PostgreSQL
{
    public class Case
    {
        public string CaseId { get; set; }
        [ForeignKey("Creator")]
        public string CreatorUserId { get; set; }
        public string Title { get; set; }
        public string? Objective { get; set; } = null;
        public List<string> CollaboratorUserId { get; set; } = new List<string>();
        public string? ExecutiveSummary { get; set; } = null;
        public string? Conclusion { get; set; } = null;
        public long? StartTime { get; set; } = null;
        public long? EndTime { get; set; } = null;
        public List<double> PersonNumber { get; set; } = new List<double>();
        public List<string> GeneralAttribute { get; set; } = new List<string>();
        public List<string> ColorAttribute { get; set; } = new List<string>();
        public List<string> TagId { get; set; } = new List<string>();
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [JsonIgnore]
        public User Creator { get; set; }
        public List<Tag> Tags { get; set; }
        public List<CaseActivity> CaseActivities { get; set; }
    }

    public class RelationCaseEvidence
    {

        public string? Id { get; set; }
        public string? CaseId { get; set; }
        public string? EvidenceId { get; set; }
        public string? Status { get; set; }
        [JsonIgnore]
        public Case Case { get; set; } // Navigation property
        [JsonIgnore]
        public Evidence Evidence { get; set; } // Navigation property



    }

    public class RelationCaseEvidenceAnalytic
    {
        public string? Id { get; set; }
        [ForeignKey("RelationCaseEvidence")]
        public string? RelationCaseEvidenceId { get; set; }
        [ForeignKey("Creator")]
        public string? CreatorUserId { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? Notes { get; set; }
        public int Level { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        [JsonIgnore]
        public User Creator { get; set; }
        [JsonIgnore]
        public RelationCaseEvidence RelationCaseEvidence { get; set; }

    }

    public class PostCaseDraftDTO
    {
        public string? CreatorUserId { get; set; }

    }

    public class PostOngoingCaseDTO
    {
        public string caseId { get; set; }
        public string? title { get; set; }
        public string? objective { get; set; }
        public string? creatorUserId { get; set; }
        public List<string> collaboratorUserId { get; set; }
        public List<double> personNumber { get; set; }
        public List<string> generalAtt { get; set; }
        public List<string> colorAtt { get; set; }
    }

    public class UpdateCaseFilterDTO
    {
        public string caseId { get; set; }
        public string[] evidenceIds { get; set; }
        public double[]? personNumber { get; set; }
        public string[]? generalAtt { get; set; }
        public string[]? colorAtt { get; set; }

    }

    public class PostRelationNotesDTO
    {
        public string? caseId { get; set; }
        public string? evidenceId { get; set; }
        public string? creatorUserId { get; set; }
        public long startTime { get; set; }
        public long endTime { get; set; }
        public string? notes {  get; set; }
        public int level { get; set; }
    }

    public class CloseCaseDTO
    {
        public string caseId { get; set; } 
        public string creatorUserId { get; set; }
        public string? reason { get; set; } = null;
    }

    public class UpdateRelationDTO
    {
        public string caseId { get; set; }
        public string evidenceId { get; set; }
        public string userId { get; set; }
        public string status { get; set; }

    }
}