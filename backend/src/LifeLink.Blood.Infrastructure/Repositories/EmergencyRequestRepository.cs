using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;
using LifeLink.Blood.Domain.Helpers;
using LifeLink.Blood.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace LifeLink.Blood.Infrastructure.Repositories;

public class EmergencyRequestRepository : GenericRepository<EmergencyRequest>, IEmergencyRequestRepository
{
    public EmergencyRequestRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<EmergencyRequest?> GetByCodeAsync(string requestCode)
    {
        return await _context.EmergencyRequests
            .Include(r => r.Pledges)
                .ThenInclude(p => p.DonorRecord)
            .FirstOrDefaultAsync(r => r.RequestCode == requestCode);
    }

    public async Task<EmergencyRequest?> GetWithDetailsAsync(Guid id)
    {
        return await _context.EmergencyRequests
            .Include(r => r.Pledges)
                .ThenInclude(p => p.DonorRecord)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IReadOnlyList<EmergencyRequest>> GetRequestsAsync(
        Guid? requesterId,
        RequestStatus? status,
        BloodGroup? userBloodGroup,
        bool isDonorView)
    {
        IQueryable<EmergencyRequest> query = _context.EmergencyRequests
            .Include(r => r.Pledges);

        if (requesterId.HasValue)
        {
            query = query.Where(r => r.RequesterId == requesterId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(r => r.Status == status.Value);
        }

        if (isDonorView && userBloodGroup.HasValue)
        {
            // For donor view, show active requests compatible with the donor's blood group
            var compatibleRecipientGroups = Enum.GetValues<BloodGroup>()
                .Where(rg => BloodGroupCompatibility.IsCompatible(userBloodGroup.Value, rg))
                .ToList();

            query = query.Where(r => r.Status != RequestStatus.FULFILLED &&
                                     r.Status != RequestStatus.REJECTED &&
                                     r.Status != RequestStatus.CANCELLED &&
                                     compatibleRecipientGroups.Contains(r.BloodGroup));
        }

        return await query.OrderByDescending(r => r.CreatedAt).ToListAsync();
    }

    public async Task<IReadOnlyList<(DonorRecord Donor, double? DistanceMeters)>> FindMatchingDonorsAsync(
        BloodGroup recipientBloodGroup,
        Point? hospitalLocation,
        double radiusKm)
    {
        var compatibleDonorGroups = BloodGroupCompatibility.GetCompatibleDonorGroups(recipientBloodGroup).ToList();

        var donors = await _context.DonorRecords
            .Where(d => d.Status == DonorStatus.ELIGIBLE && compatibleDonorGroups.Contains(d.BloodGroup))
            .ToListAsync();

        var result = new List<(DonorRecord Donor, double? DistanceMeters)>();
        var radiusMeters = radiusKm * 1000.0;

        foreach (var donor in donors)
        {
            double? distMeters = null;
            if (hospitalLocation != null && donor.Location != null)
            {
                distMeters = hospitalLocation.Distance(donor.Location);
                if (distMeters > radiusMeters)
                {
                    continue;
                }
            }
            result.Add((donor, distMeters));
        }

        if (hospitalLocation != null)
        {
            result = result.OrderBy(r => r.DistanceMeters ?? double.MaxValue).ToList();
        }

        return result;
    }
}
