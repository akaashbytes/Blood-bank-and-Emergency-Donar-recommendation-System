using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;
using LifeLink.Blood.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LifeLink.Blood.Infrastructure.Repositories;

public class ExpiryAlertRepository : GenericRepository<ExpiryAlert>, IExpiryAlertRepository
{
    public ExpiryAlertRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<ExpiryAlert>> GetAlertsAsync(ExpiryAlertStatus? status)
    {
        IQueryable<ExpiryAlert> query = _context.ExpiryAlerts;

        if (status.HasValue)
        {
            query = query.Where(a => a.Status == status.Value);
        }

        return await query.OrderBy(a => a.DaysRemaining).ToListAsync();
    }
}
