using LifeLink.Blood.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LifeLink.Blood.Infrastructure.Data.Configurations;

public class ExpiryAlertConfiguration : IEntityTypeConfiguration<ExpiryAlert>
{
    public void Configure(EntityTypeBuilder<ExpiryAlert> builder)
    {
        builder.ToTable("expiry_alerts");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.UnitId)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.BloodGroup)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(e => e.Component)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(e => e.Status)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(e => e.Location)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasOne(e => e.BloodStockItem)
            .WithMany(b => b.ExpiryAlerts)
            .HasForeignKey(e => e.BloodStockItemId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
