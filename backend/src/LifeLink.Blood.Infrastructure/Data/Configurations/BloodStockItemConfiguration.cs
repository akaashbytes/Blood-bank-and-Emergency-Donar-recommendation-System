using LifeLink.Blood.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LifeLink.Blood.Infrastructure.Data.Configurations;

public class BloodStockItemConfiguration : IEntityTypeConfiguration<BloodStockItem>
{
    public void Configure(EntityTypeBuilder<BloodStockItem> builder)
    {
        builder.ToTable("blood_stock_items");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.BloodGroup)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(b => b.Component)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(b => b.UnitsAvailable)
            .IsRequired();

        builder.Property(b => b.ReservedUnits)
            .IsRequired();

        builder.Property(b => b.CriticalThreshold)
            .IsRequired();

        builder.Property(b => b.StorageUnit)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(b => b.VaultLocation)
            .HasColumnType("geography (point, 4326)");

        builder.Property<uint>("Version")
            .IsRowVersion();
    }
}
