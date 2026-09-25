using AutoMapper;
using LifeLink.Blood.Application.DTOs.Auth;
using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Application.Services;

public class AuthService : IAuthService
{
    private readonly IGenericRepository<User> _userRepository;
    private readonly IGenericRepository<DonorRecord> _donorRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IMapper _mapper;

    public AuthService(
        IGenericRepository<User> userRepository,
        IGenericRepository<DonorRecord> donorRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        IPasswordHasher passwordHasher,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _donorRepository = donorRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
        _mapper = mapper;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var users = await _userRepository.FindAsync(u => u.Email.ToLower() == request.Email.ToLower());
        var user = users.FirstOrDefault();

        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("User account is deactivated.");
        }

        var (token, refreshToken, expiresAt) = _jwtTokenGenerator.GenerateToken(user);
        var userDto = _mapper.Map<UserDto>(user);

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = expiresAt,
            User = userDto
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var existing = await _userRepository.FindAsync(u => u.Email.ToLower() == request.Email.ToLower());
        if (existing.Any())
        {
            throw new InvalidOperationException("User with this email already exists.");
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            Role = request.Role,
            Phone = request.Phone,
            BloodGroup = request.BloodGroup,
            City = request.City,
            InstitutionName = request.InstitutionName,
            IsActive = true
        };

        await _userRepository.AddAsync(user);

        if (user.Role == UserRole.DONOR && user.BloodGroup.HasValue)
        {
            var donorRecord = new DonorRecord
            {
                UserId = user.Id,
                DonorCode = $"LIFELINK-D-{new Random().Next(1000, 9999)}",
                FullName = user.Name,
                BloodGroup = user.BloodGroup.Value,
                Age = 25,
                Gender = "Unspecified",
                City = user.City ?? "New Delhi",
                Phone = user.Phone ?? string.Empty,
                Email = user.Email,
                NextEligibleDate = DateTime.UtcNow.AddDays(90),
                TotalDonations = 0,
                Status = DonorStatus.ELIGIBLE,
                VerifiedBadge = false
            };

            await _donorRepository.AddAsync(donorRecord);
        }

        var (token, refreshToken, expiresAt) = _jwtTokenGenerator.GenerateToken(user);
        var userDto = _mapper.Map<UserDto>(user);

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = expiresAt,
            User = userDto
        };
    }

    public async Task<UserDto> GetCurrentUserAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        return _mapper.Map<UserDto>(user);
    }
}
