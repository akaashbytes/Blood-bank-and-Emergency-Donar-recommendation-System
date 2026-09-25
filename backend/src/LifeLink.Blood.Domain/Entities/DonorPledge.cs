using LifeLink.Blood.Domain.Common;

namespace LifeLink.Blood.Domain.Entities;

public class DonorPledge : BaseEntity
{
    public Guid EmergencyRequestId { get; set; }
    public EmergencyRequest EmergencyRequest { get; set; } = null!;

    public Guid DonorRecordId { get; set; }
    public DonorRecord DonorRecord { get; set; } = null!;

    public string PreferredCenter { get; set; } = string.Empty;
    public DateTime PreferredDate { get; set; }
    public string Status { get; set; } = "REGISTERED";
}
