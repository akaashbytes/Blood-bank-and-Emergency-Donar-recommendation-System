namespace LifeLink.Blood.Application.DTOs.DonorPledge;

public class DonorPledgeDto
{
    public Guid Id { get; set; }
    public Guid EmergencyRequestId { get; set; }
    public Guid DonorRecordId { get; set; }
    public string DonorCode { get; set; } = string.Empty;
    public string DonorName { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public string PreferredCenter { get; set; } = string.Empty;
    public DateTime PreferredDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
