namespace LifeLink.Blood.Application.DTOs.EmergencyRequest;

public class AllocateBloodStockDto
{
    public Guid BloodStockItemId { get; set; }
    public int UnitsToAllocate { get; set; }
}
