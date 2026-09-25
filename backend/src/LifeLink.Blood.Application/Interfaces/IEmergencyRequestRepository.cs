using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;
using NetTopologySuite.Geometries;

namespace LifeLink.Blood.Application.Interfaces;

public interface IEmergencyRequestRepository : IGenericRepository<EmergencyRequest>
{
    Task<EmergencyRequest?> GetByCodeAsync(string requestCode);
    Task<EmergencyRequest?> GetWithDetailsAsync(Guid id);
    Task<IReadOnlyList<EmergencyRequest>> GetRequestsAsync(
        Guid? requesterId,
        RequestStatus? status,
        BloodGroup? userBloodGroup,
        bool isDonorView);
    Task<IReadOnlyList<(DonorRecord Donor, double? DistanceMeters)>> FindMatchingDonorsAsync(
        BloodGroup recipientBloodGroup,
        Point? hospitalLocation,
        double radiusKm);
}
