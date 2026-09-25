namespace LifeLink.Blood.Application.DTOs.EmergencyRequest;

public class UpdateRequestStatusDto
{
    public string Status { get; set; } = string.Empty;
    public int? UnitsAllocated { get; set; }
    public string? Notes { get; set; }
}
