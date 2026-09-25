using LifeLink.Blood.Application.DTOs.AuditLog;
using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Application.Services;

public class AuditLogService : IAuditLogService
{
    private readonly IAuditLogRepository _auditLogRepository;

    public AuditLogService(IAuditLogRepository auditLogRepository)
    {
        _auditLogRepository = auditLogRepository;
    }

    public async Task LogAsync(
        Guid? userId,
        string userDisplay,
        UserRole role,
        string action,
        string module,
        string ipAddress,
        string details,
        AuditStatus status)
    {
        var log = new AuditLog
        {
            UserId = userId,
            UserDisplay = string.IsNullOrWhiteSpace(userDisplay) ? "System / Anonymous" : userDisplay,
            Role = role,
            Action = action,
            Module = module,
            IpAddress = string.IsNullOrWhiteSpace(ipAddress) ? "127.0.0.1" : ipAddress,
            Details = details,
            Status = status,
            EventTimestamp = DateTime.UtcNow
        };

        await _auditLogRepository.AddAsync(log);
    }

    public async Task<IReadOnlyList<AuditLogDto>> GetAuditLogsAsync(
        string? module,
        string? action,
        string? status,
        int page = 1,
        int pageSize = 50)
    {
        AuditStatus? parsedStatus = null;
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<AuditStatus>(status, true, out var res))
        {
            parsedStatus = res;
        }

        var logs = await _auditLogRepository.GetAuditLogsAsync(module, action, parsedStatus, page, pageSize);

        return logs.Select(l => new AuditLogDto
        {
            Id = l.Id,
            EventTimestamp = l.EventTimestamp,
            UserId = l.UserId,
            UserDisplay = l.UserDisplay,
            Role = l.Role.ToString(),
            Action = l.Action,
            Module = l.Module,
            IpAddress = l.IpAddress,
            Details = l.Details,
            Status = l.Status.ToString()
        }).ToList();
    }
}
