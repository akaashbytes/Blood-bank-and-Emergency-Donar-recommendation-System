using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Application.Interfaces;

public interface IAuditLogRepository : IGenericRepository<AuditLog>
{
    Task<IReadOnlyList<AuditLog>> GetAuditLogsAsync(
        string? module,
        string? action,
        AuditStatus? status,
        int page = 1,
        int pageSize = 50);
}
