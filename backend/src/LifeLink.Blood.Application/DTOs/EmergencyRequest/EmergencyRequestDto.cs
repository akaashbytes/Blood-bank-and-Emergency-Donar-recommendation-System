using LifeLink.Blood.Application.DTOs.DonorPledge;

namespace LifeLink.Blood.Application.DTOs.EmergencyRequest;

public class EmergencyRequestDto
{
    public Guid Id { get; set; }
    public string RequestCode { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public string HospitalName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public string Component { get; set; } = string.Empty;
    public int UnitsRequired { get; set; }
    public int UnitsAllocated { get; set; }
    public string Urgency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public Guid? RequesterId { get; set; }
    public string RequesterName { get; set; } = string.Empty;
    public string RequesterContact { get; set; } = string.Empty;
    public string RequiredBy { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public double? HospitalLatitude { get; set; }
    public double? HospitalLongitude { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int PledgesCount { get; set; }
    public List<DonorPledgeDto> Pledges { get; set; } = new();
}
