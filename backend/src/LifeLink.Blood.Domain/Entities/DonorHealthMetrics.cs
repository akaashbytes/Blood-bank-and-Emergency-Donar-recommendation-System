using LifeLink.Blood.Domain.Common;

namespace LifeLink.Blood.Domain.Entities;

public class DonorHealthMetrics : BaseEntity
{
    public Guid DonorRecordId { get; set; }
    public decimal WeightKg { get; set; }
    public decimal Hemoglobin { get; set; }
    public string BloodPressure { get; set; } = string.Empty;
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public DonorRecord DonorRecord { get; set; } = null!;
}
