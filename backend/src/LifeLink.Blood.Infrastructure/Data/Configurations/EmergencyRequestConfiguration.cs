using LifeLink.Blood.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LifeLink.Blood.Infrastructure.Data.Configurations;

public class EmergencyRequestConfiguration : IEntityTypeConfiguration<EmergencyRequest>
{
    public void Configure(EntityTypeBuilder<EmergencyRequest> builder)
    {
        builder.ToTable("emergency_requests");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.RequestCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(r => r.RequestCode)
            .IsUnique();

        builder.Property(r => r.PatientName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(r => r.HospitalName)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(r => r.City)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(r => r.BloodGroup)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(r => r.Component)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(r => r.Urgency)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(r => r.Status)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(r => r.RequesterName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(r => r.RequesterContact)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(r => r.RequiredBy)
            .HasMaxLength(100);

        builder.Property(r => r.HospitalLocation)
            .HasColumnType("geography(Point, 4326)");

        builder.HasOne(r => r.Requester)
            .WithMany()
            .HasForeignKey(r => r.RequesterId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(r => r.Pledges)
            .WithOne(p => p.EmergencyRequest)
            .HasForeignKey(p => p.EmergencyRequestId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
