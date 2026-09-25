using LifeLink.Blood.Domain.Common;
using LifeLink.Blood.Domain.Enums;
using NetTopologySuite.Geometries;

namespace LifeLink.Blood.Domain.Entities;

public class BloodStockItem : BaseEntity
{
    public BloodGroup BloodGroup { get; set; }
    public ComponentType Component { get; set; }
    public int UnitsAvailable { get; set; }
    public int ReservedUnits { get; set; }
    public int CriticalThreshold { get; set; } = 10;
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    public int ExpiryAlertsCount { get; set; }
    public string StorageUnit { get; set; } = string.Empty;
    public Point? VaultLocation { get; set; }

    // Navigation properties
    public ICollection<ExpiryAlert> ExpiryAlerts { get; set; } = new List<ExpiryAlert>();
}
