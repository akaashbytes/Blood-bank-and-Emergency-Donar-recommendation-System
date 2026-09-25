namespace LifeLink.Blood.Application.DTOs.BloodStock;

public class BloodStockItemDto
{
    public Guid Id { get; set; }
    public string BloodGroup { get; set; } = string.Empty;
    public string Component { get; set; } = string.Empty;
    public int UnitsAvailable { get; set; }
    public int ReservedUnits { get; set; }
    public int CriticalThreshold { get; set; }
    public DateTime LastUpdated { get; set; }
    public int ExpiryAlertsCount { get; set; }
    public string StorageUnit { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public double? DistanceKm { get; set; }
}
