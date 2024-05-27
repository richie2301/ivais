using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ignis.Domain.Model.PostgreSQL
{
    public class Tag
    {
        public string TagId { get; set; }
        [ForeignKey("Creator")]
        public string CreatorUserId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [JsonIgnore]
        public User Creator { get; set; }
        [JsonIgnore]
        public List<Mission> Missions { get; set; }
        [JsonIgnore]
        public List<Evidence> Evidences { get; set; }
        [JsonIgnore]
        public List<FaceRecognitionDataTimeSeriesTag> FaceRecognitionDataTimeSeriesTags { get; set; }
        [JsonIgnore]
        public List<PeopleAttributeDataTimeSeriesTag> PeopleAttributeDataTimeSeriesTags { get; set; }
        [JsonIgnore]
        public List<Case> Cases { get; set; }
    }

    public class CaseTag
    {
        public string CaseTagId { get; set; }
        public string CreatorUserId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        [JsonIgnore]
        public User Creator { get; set; }
    }

    public class RelationCaseTag
    {
        public string id { get; set; }
        public string CaseId { get; set; }
        public string TagId { get; set; }
        public string Status { get; set; }
        Case Case { get; set; }
        Tag Tag { get; set; }
    }

    public class CaseTagDTO
    {
        public string CaseId { get; set; }
        public string CreatorUserId { get; set; }
        public string TagName { get; set; }
    }
}