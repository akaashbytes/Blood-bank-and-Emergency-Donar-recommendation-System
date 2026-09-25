namespace LifeLink.Blood.Application.DTOs.DonorPledge;

public class CreateDonorPledgeDto
{
    public Guid EmergencyRequestId { get; set; }
    public string PreferredCenter { get; set; } = string.Empty;
    public DateTime PreferredDate { get; set; }
}
