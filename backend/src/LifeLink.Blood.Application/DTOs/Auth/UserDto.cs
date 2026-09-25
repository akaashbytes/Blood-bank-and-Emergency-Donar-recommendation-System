using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Application.DTOs.Auth;

public class UserDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string? Phone { get; set; }
    public BloodGroup? BloodGroup { get; set; }
    public string? InstitutionName { get; set; }
    public string? City { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; }
}
