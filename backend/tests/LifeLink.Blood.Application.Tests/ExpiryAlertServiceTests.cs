using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Application.Services;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;
using Moq;
using Xunit;

namespace LifeLink.Blood.Application.Tests;

public class ExpiryAlertServiceTests
{
    private readonly Mock<IExpiryAlertRepository> _mockAlertRepo;
    private readonly ExpiryAlertService _service;

    public ExpiryAlertServiceTests()
    {
        _mockAlertRepo = new Mock<IExpiryAlertRepository>();
        _service = new ExpiryAlertService(_mockAlertRepo.Object, null!);
    }

    [Fact]
    public async Task GetExpiryAlertsAsync_ShouldReturnMappedDtos()
    {
        // Arrange
        var alerts = new List<ExpiryAlert>
        {
            new ExpiryAlert
            {
                Id = Guid.NewGuid(),
                UnitId = "U-100",
                BloodGroup = BloodGroup.O_POS,
                Component = ComponentType.PRBC,
                QuantityUnits = 5,
                ExpiryDate = DateTime.UtcNow.AddHours(12),
                DaysRemaining = 1,
                Status = ExpiryAlertStatus.CRITICAL_24H,
                Location = "Vault A"
            }
        };

        _mockAlertRepo.Setup(r => r.GetAlertsAsync(It.IsAny<ExpiryAlertStatus?>()))
            .ReturnsAsync(alerts);

        // Act
        var result = await _service.GetExpiryAlertsAsync("CRITICAL_24H");

        // Assert
        Assert.Single(result);
        Assert.Equal("O+", result[0].BloodGroup);
        Assert.Equal("PRBC (Red Cells)", result[0].Component);
        Assert.Equal("CRITICAL_24H", result[0].Status);
    }

    [Fact]
    public async Task ProcessExpiryAlertsAsync_ShouldUpdateAlertStatusToCritical24H_WhenExpiringInOneDay()
    {
        // Arrange
        var alert = new ExpiryAlert
        {
            Id = Guid.NewGuid(),
            UnitId = "U-200",
            BloodGroup = BloodGroup.A_POS,
            Component = ComponentType.PLATELETS,
            ExpiryDate = DateTime.UtcNow.AddHours(18),
            DaysRemaining = 3,
            Status = ExpiryAlertStatus.WARNING_72H
        };

        _mockAlertRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<ExpiryAlert> { alert });
        _mockAlertRepo.Setup(r => r.UpdateAsync(It.IsAny<ExpiryAlert>())).Returns(Task.CompletedTask);

        // Act
        await _service.ProcessExpiryAlertsAsync();

        // Assert
        Assert.Equal(ExpiryAlertStatus.CRITICAL_24H, alert.Status);
        _mockAlertRepo.Verify(r => r.UpdateAsync(It.Is<ExpiryAlert>(a => a.Status == ExpiryAlertStatus.CRITICAL_24H)), Times.Once);
    }

    [Fact]
    public async Task ProcessExpiryAlertsAsync_ShouldUpdateAlertStatusToExpired_WhenExpiryDatePassed()
    {
        // Arrange
        var alert = new ExpiryAlert
        {
            Id = Guid.NewGuid(),
            UnitId = "U-300",
            BloodGroup = BloodGroup.B_NEG,
            Component = ComponentType.FFP,
            ExpiryDate = DateTime.UtcNow.AddHours(-2),
            DaysRemaining = 1,
            Status = ExpiryAlertStatus.CRITICAL_24H
        };

        _mockAlertRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<ExpiryAlert> { alert });
        _mockAlertRepo.Setup(r => r.UpdateAsync(It.IsAny<ExpiryAlert>())).Returns(Task.CompletedTask);

        // Act
        await _service.ProcessExpiryAlertsAsync();

        // Assert
        Assert.Equal(ExpiryAlertStatus.EXPIRED, alert.Status);
        Assert.Equal(0, alert.DaysRemaining);
        _mockAlertRepo.Verify(r => r.UpdateAsync(It.Is<ExpiryAlert>(a => a.Status == ExpiryAlertStatus.EXPIRED)), Times.Once);
    }
}
