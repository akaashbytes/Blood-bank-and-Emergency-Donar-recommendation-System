using LifeLink.Blood.Application.DTOs.DonorPledge;
using LifeLink.Blood.Application.DTOs.EmergencyRequest;
using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Application.Interfaces;

public interface IEmergencyRequestService
{
    Task<EmergencyRequestDto> CreateRequestAsync(CreateEmergencyRequestDto dto, Guid requesterUserId, string requesterName, string requesterContact, string ipAddress);
    Task<IReadOnlyList<EmergencyRequestDto>> GetRequestsAsync(Guid userId, UserRole role, string? statusFilter, BloodGroup? userBloodGroup);
    Task<EmergencyRequestDto> GetRequestByIdAsync(Guid id);
    Task<EmergencyRequestDto> GetRequestByCodeAsync(string requestCode);
    Task<EmergencyRequestDto> UpdateRequestStatusAsync(Guid id, UpdateRequestStatusDto dto, Guid userId, string userDisplay, UserRole role, string ipAddress);
    Task<IReadOnlyList<DonorCandidateMatchDto>> FindMatchingDonorsAsync(Guid requestId, double? radiusKm);
    Task<DonorPledgeDto> PledgeDonorAsync(CreateDonorPledgeDto dto, Guid donorUserId, string ipAddress);
    Task<EmergencyRequestDto> AllocateInventoryAsync(Guid requestId, AllocateBloodStockDto dto, Guid userId, string userDisplay, UserRole role, string ipAddress);
}
