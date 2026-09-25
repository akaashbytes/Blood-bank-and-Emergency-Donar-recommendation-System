namespace LifeLink.Blood.Application.DTOs.AuditLog;

public class AuditLogDto
{
    public Guid Id { get; set; }
    public DateTime EventTimestamp { get; set; }
    public Guid? UserId { get; set; }
    public string UserDisplay { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
