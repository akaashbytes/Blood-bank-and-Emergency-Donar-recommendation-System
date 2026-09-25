using LifeLink.Blood.Domain.Common;
using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Domain.Entities;

public class ExpiryAlert : BaseEntity
{
    public Guid? BloodStockItemId { get; set; }
    public string UnitId { get; set; } = string.Empty;
    public BloodGroup BloodGroup { get; set; }
    public ComponentType Component { get; set; }
    public int QuantityUnits { get; set; }
    public DateTime ExpiryDate { get; set; }
    public int DaysRemaining { get; set; }
    public ExpiryAlertStatus Status { get; set; }
    public string Location { get; set; } = string.Empty;

    // Navigation property
    public BloodStockItem? BloodStockItem { get; set; }
}
