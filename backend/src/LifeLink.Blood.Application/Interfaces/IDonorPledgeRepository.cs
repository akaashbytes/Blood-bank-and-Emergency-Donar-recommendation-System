using LifeLink.Blood.Domain.Entities;

namespace LifeLink.Blood.Application.Interfaces;

public interface IDonorPledgeRepository : IGenericRepository<DonorPledge>
{
    Task<IReadOnlyList<DonorPledge>> GetPledgesByRequestIdAsync(Guid emergencyRequestId);
    Task<IReadOnlyList<DonorPledge>> GetPledgesByDonorIdAsync(Guid donorRecordId);
    Task<bool> HasDonorPledgedAsync(Guid emergencyRequestId, Guid donorRecordId);
}
