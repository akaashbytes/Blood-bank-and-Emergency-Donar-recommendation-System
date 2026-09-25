using LifeLink.Blood.Domain.Entities;

namespace LifeLink.Blood.Application.Interfaces;

public interface IDonorRepository : IGenericRepository<DonorRecord>
{
    Task<DonorRecord?> GetDonorWithHealthMetricsByUserIdAsync(Guid userId);
    Task<DonorRecord?> GetByUserIdAsync(Guid userId);
}
