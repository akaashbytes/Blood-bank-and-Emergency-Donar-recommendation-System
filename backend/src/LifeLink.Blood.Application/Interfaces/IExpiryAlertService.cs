using LifeLink.Blood.Application.DTOs.ExpiryAlert;

namespace LifeLink.Blood.Application.Interfaces;

public interface IExpiryAlertService
{
    Task<IReadOnlyList<ExpiryAlertDto>> GetExpiryAlertsAsync(string? status);
    Task ProcessExpiryAlertsAsync();
}
