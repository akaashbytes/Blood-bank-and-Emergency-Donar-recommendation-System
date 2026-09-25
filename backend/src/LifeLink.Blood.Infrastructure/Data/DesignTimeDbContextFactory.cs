using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace LifeLink.Blood.Infrastructure.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
        
        builder.UseNpgsql(
            "Host=localhost;Port=5432;Database=lifelink_blood;Username=postgres;Password=postgres",
            o => o.UseNetTopologySuite()
        );

        return new ApplicationDbContext(builder.Options);
    }
}
