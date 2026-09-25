namespace LifeLink.Blood.Application.DTOs.EmergencyRequest;

public class DonorCandidateMatchDto
{
    public Guid DonorRecordId { get; set; }
    public string DonorCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public double? DistanceKm { get; set; }
    public int TotalDonations { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool VerifiedBadge { get; set; }
}
