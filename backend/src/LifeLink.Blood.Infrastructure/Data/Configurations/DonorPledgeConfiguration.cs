using LifeLink.Blood.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LifeLink.Blood.Infrastructure.Data.Configurations;

public class DonorPledgeConfiguration : IEntityTypeConfiguration<DonorPledge>
{
    public void Configure(EntityTypeBuilder<DonorPledge> builder)
    {
        builder.ToTable("donor_pledges");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.PreferredCenter)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(p => p.Status)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasOne(p => p.EmergencyRequest)
            .WithMany(r => r.Pledges)
            .HasForeignKey(p => p.EmergencyRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.DonorRecord)
            .WithMany()
            .HasForeignKey(p => p.DonorRecordId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
