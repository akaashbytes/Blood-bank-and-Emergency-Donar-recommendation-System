using LifeLink.Blood.Domain.Common;
using LifeLink.Blood.Domain.Enums;
using NetTopologySuite.Geometries;

namespace LifeLink.Blood.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string? Phone { get; set; }
    public BloodGroup? BloodGroup { get; set; }
    public string? InstitutionName { get; set; }
    public string? City { get; set; }
    public string? AvatarUrl { get; set; }
    public Point? Location { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public DonorRecord? DonorRecord { get; set; }
}
