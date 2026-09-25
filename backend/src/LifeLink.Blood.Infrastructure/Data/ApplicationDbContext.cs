using LifeLink.Blood.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LifeLink.Blood.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<DonorRecord> DonorRecords => Set<DonorRecord>();
    public DbSet<DonorHealthMetrics> DonorHealthMetrics => Set<DonorHealthMetrics>();
    public DbSet<BloodStockItem> BloodStockItems => Set<BloodStockItem>();
    public DbSet<ExpiryAlert> ExpiryAlerts => Set<ExpiryAlert>();
    public DbSet<EmergencyRequest> EmergencyRequests => Set<EmergencyRequest>();
    public DbSet<DonorPledge> DonorPledges => Set<DonorPledge>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasPostgresExtension("postgis");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
