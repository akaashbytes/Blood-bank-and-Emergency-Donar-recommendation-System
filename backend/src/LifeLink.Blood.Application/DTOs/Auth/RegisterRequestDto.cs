using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Application.DTOs.Auth;

public class RegisterRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string Phone { get; set; } = string.Empty;
    public BloodGroup? BloodGroup { get; set; }
    public string City { get; set; } = string.Empty;
    public string? InstitutionName { get; set; }
}
