using ignis.Domain.Model.PostgreSQL;
using Microsoft.EntityFrameworkCore;

namespace ignis.Domain.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<User> User { get; set; }
        public DbSet<Mission> Mission { get; set; }
        public DbSet<Case> Case { get; set; }
        public DbSet<Evidence> Evidence { get; set; }
        public DbSet<EvidenceSource> EvidenceSource { get; set; }
        public DbSet<EvidenceAnalytic> EvidenceAnalytic { get; set; }
        public DbSet<RelationCaseEvidence> RelationCaseEvidences { get; set; }
        public DbSet<RelationCaseEvidenceAnalytic> RelationCaseEvidenceAnalytics { get; set; }
        public DbSet<Person> Person { get; set; }
        public DbSet<Tag> Tag { get; set; }
        public DbSet<FaceRecognitionDataTimeSeriesTag> FaceRecognitionDataTimeSeriesTag { get; set; }
        public DbSet<PeopleAttributeDataTimeSeriesTag> PeopleAttributeDataTimeSeriesTag { get; set; }
        public DbSet<Activity> Activity { get; set; }
        public DbSet<EvidenceActivity> EvidenceActivity { get; set; }
        public DbSet<CaseActivity> CaseActivity { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<FaceRecognitionDataTimeSeriesTag>()
                .HasKey(frdtst => new { frdtst.TagId, frdtst.FaceRecognitionDataTimestamp, frdtst.DocumentId });

            modelBuilder.Entity<PeopleAttributeDataTimeSeriesTag>()
                .HasKey(padtst => new { padtst.TagId, padtst.PeopleAttributeDataTimestamp, padtst.DocumentId });

            foreach (var foreignKey in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Cascade;
            }
        }
    }
}