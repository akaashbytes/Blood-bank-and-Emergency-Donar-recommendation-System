using LifeLink.Blood.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LifeLink.Blood.Infrastructure.Data.Configurations;

public class DonorRecordConfiguration : IEntityTypeConfiguration<DonorRecord>
{
    public void Configure(EntityTypeBuilder<DonorRecord> builder)
    {
        builder.ToTable("donor_records");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.DonorCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(d => d.DonorCode)
            .IsUnique();

        builder.Property(d => d.FullName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(d => d.BloodGroup)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(d => d.Gender)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(d => d.City)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.Phone)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(d => d.Email)
            .IsRequired()
            .HasMaxLength(254);

        builder.Property(d => d.Status)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(d => d.Location)
            .HasColumnType("geography (point, 4326)");

        builder.HasOne(d => d.User)
            .WithOne(u => u.DonorRecord)
            .HasForeignKey<DonorRecord>(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
