using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LifeLink.Blood.Infrastructure.Repositories;

public class DonorPledgeRepository : GenericRepository<DonorPledge>, IDonorPledgeRepository
{
    public DonorPledgeRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<DonorPledge>> GetPledgesByRequestIdAsync(Guid emergencyRequestId)
    {
        return await _context.DonorPledges
            .Include(p => p.DonorRecord)
            .Where(p => p.EmergencyRequestId == emergencyRequestId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<DonorPledge>> GetPledgesByDonorIdAsync(Guid donorRecordId)
    {
        return await _context.DonorPledges
            .Include(p => p.EmergencyRequest)
            .Where(p => p.DonorRecordId == donorRecordId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> HasDonorPledgedAsync(Guid emergencyRequestId, Guid donorRecordId)
    {
        return await _context.DonorPledges
            .AnyAsync(p => p.EmergencyRequestId == emergencyRequestId && p.DonorRecordId == donorRecordId);
    }
}
