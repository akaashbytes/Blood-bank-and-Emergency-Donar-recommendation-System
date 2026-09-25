using LifeLink.Blood.Domain.Common;
using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Domain.Entities;

public class AuditLog : BaseEntity
{
    public DateTime EventTimestamp { get; set; } = DateTime.UtcNow;
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public string UserDisplay { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public AuditStatus Status { get; set; } = AuditStatus.SUCCESS;
}
