namespace LifeLink.Blood.Application.DTOs.ExpiryAlert;

public class ExpiryAlertDto
{
    public Guid Id { get; set; }
    public string UnitId { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public string Component { get; set; } = string.Empty;
    public int QuantityUnits { get; set; }
    public DateTime ExpiryDate { get; set; }
    public int DaysRemaining { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
}
