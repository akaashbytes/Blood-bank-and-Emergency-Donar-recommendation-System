using LifeLink.Blood.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LifeLink.Blood.Infrastructure.Data.Configurations;

public class DonorHealthMetricsConfiguration : IEntityTypeConfiguration<DonorHealthMetrics>
{
    public void Configure(EntityTypeBuilder<DonorHealthMetrics> builder)
    {
        builder.ToTable("donor_health_metrics");

        builder.HasKey(h => h.Id);

        builder.Property(h => h.WeightKg)
            .HasPrecision(5, 2)
            .IsRequired();

        builder.Property(h => h.Hemoglobin)
            .HasPrecision(4, 1)
            .IsRequired();

        builder.Property(h => h.BloodPressure)
            .IsRequired()
            .HasMaxLength(20);

        builder.HasOne(h => h.DonorRecord)
            .WithOne(d => d.HealthMetrics)
            .HasForeignKey<DonorHealthMetrics>(h => h.DonorRecordId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
