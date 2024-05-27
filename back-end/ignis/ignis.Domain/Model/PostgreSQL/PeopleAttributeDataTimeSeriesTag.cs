using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ignis.Domain.Model.PostgreSQL
{
    public class PeopleAttributeDataTimeSeriesTag
    {
        [Key, ForeignKey("Tag")]
        public string TagId { get; set; }
        [Key]
        public DateTime PeopleAttributeDataTimestamp { get; set; }
        [Key]
        public string DocumentId { get; set; }

        public Tag Tag { get; set; }
    }
}