using LifeLink.Blood.Domain.Entities;

namespace LifeLink.Blood.Application.Interfaces;

public interface IJwtTokenGenerator
{
    (string Token, string RefreshToken, DateTime ExpiresAt) GenerateToken(User user);
}
