using LifeLink.Blood.Application.DTOs.Donor;

namespace LifeLink.Blood.Application.Interfaces;

public interface IDonorService
{
    Task<DonorRecordDto?> GetDonorByUserIdAsync(Guid userId);
    Task<IReadOnlyList<DonorListItemDto>> GetAllDonorsAsync();
}
