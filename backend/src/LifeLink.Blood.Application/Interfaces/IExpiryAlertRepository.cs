using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Application.Interfaces;

public interface IExpiryAlertRepository : IGenericRepository<ExpiryAlert>
{
    Task<IReadOnlyList<ExpiryAlert>> GetAlertsAsync(ExpiryAlertStatus? status);
}
