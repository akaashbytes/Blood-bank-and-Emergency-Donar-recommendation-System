using LifeLink.Blood.Application.DTOs.AuditLog;
using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Application.Interfaces;

public interface IAuditLogService
{
    Task LogAsync(Guid? userId, string userDisplay, UserRole role, string action, string module, string ipAddress, string details, AuditStatus status);
    Task<IReadOnlyList<AuditLogDto>> GetAuditLogsAsync(string? module, string? action, string? status, int page = 1, int pageSize = 50);
}
