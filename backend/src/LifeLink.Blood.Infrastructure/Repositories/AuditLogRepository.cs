using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;
using LifeLink.Blood.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LifeLink.Blood.Infrastructure.Repositories;

public class AuditLogRepository : GenericRepository<AuditLog>, IAuditLogRepository
{
    public AuditLogRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<AuditLog>> GetAuditLogsAsync(
        string? module,
        string? action,
        AuditStatus? status,
        int page = 1,
        int pageSize = 50)
    {
        IQueryable<AuditLog> query = _context.AuditLogs;

        if (!string.IsNullOrWhiteSpace(module))
        {
            var moduleLower = module.Trim().ToLower();
            query = query.Where(a => a.Module.ToLower().Contains(moduleLower));
        }

        if (!string.IsNullOrWhiteSpace(action))
        {
            var actionLower = action.Trim().ToLower();
            query = query.Where(a => a.Action.ToLower().Contains(actionLower));
        }

        if (status.HasValue)
        {
            query = query.Where(a => a.Status == status.Value);
        }

        return await query
            .OrderByDescending(a => a.EventTimestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
}
