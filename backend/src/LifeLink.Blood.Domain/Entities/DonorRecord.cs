using LifeLink.Blood.Domain.Common;
using LifeLink.Blood.Domain.Enums;
using NetTopologySuite.Geometries;

namespace LifeLink.Blood.Domain.Entities;

public class DonorRecord : BaseEntity
{
    public Guid UserId { get; set; }
    public string DonorCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public BloodGroup BloodGroup { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime? LastDonatedDate { get; set; }
    public DateTime NextEligibleDate { get; set; }
    public int TotalDonations { get; set; }
    public DonorStatus Status { get; set; } = DonorStatus.PENDING_VERIFICATION;
    public bool VerifiedBadge { get; set; } = false;
    public Point? Location { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public DonorHealthMetrics? HealthMetrics { get; set; }
}
