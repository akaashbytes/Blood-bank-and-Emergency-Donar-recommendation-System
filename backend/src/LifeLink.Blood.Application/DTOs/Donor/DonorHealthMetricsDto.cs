namespace LifeLink.Blood.Application.DTOs.Donor;

public class DonorHealthMetricsDto
{
    public decimal WeightKg { get; set; }
    public decimal Hemoglobin { get; set; }
    public string BloodPressure { get; set; } = string.Empty;
    public DateTime RecordedAt { get; set; }
}
