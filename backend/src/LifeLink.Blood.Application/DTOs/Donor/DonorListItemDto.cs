using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Application.DTOs.Donor;

public class DonorListItemDto
{
    public Guid Id { get; set; }
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
    public DonorStatus Status { get; set; }
    public bool VerifiedBadge { get; set; }
}
