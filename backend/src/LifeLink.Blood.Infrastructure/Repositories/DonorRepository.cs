using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LifeLink.Blood.Infrastructure.Repositories;

public class DonorRepository : GenericRepository<DonorRecord>, IDonorRepository
{
    public DonorRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<DonorRecord?> GetDonorWithHealthMetricsByUserIdAsync(Guid userId)
    {
        return await _context.DonorRecords
            .Include(d => d.HealthMetrics)
            .FirstOrDefaultAsync(d => d.UserId == userId);
    }

    public async Task<DonorRecord?> GetByUserIdAsync(Guid userId)
    {
        return await _context.DonorRecords
            .FirstOrDefaultAsync(d => d.UserId == userId);
    }
}
