namespace LifeLink.Blood.Application.DTOs.EmergencyRequest;

public class CreateEmergencyRequestDto
{
    public string PatientName { get; set; } = string.Empty;
    public string HospitalName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public string Component { get; set; } = string.Empty;
    public int UnitsRequired { get; set; }
    public string Urgency { get; set; } = "ROUTINE";
    public string RequiredBy { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public double? HospitalLatitude { get; set; }
    public double? HospitalLongitude { get; set; }
}
