using AutoMapper;
using LifeLink.Blood.Application.DTOs.BloodStock;
using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Application.Services;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;
using Moq;
using Xunit;

namespace LifeLink.Blood.Application.Tests;

public class BloodStockServiceTests
{
    private readonly Mock<IBloodStockRepository> _mockRepo;
    private readonly Mock<IMapper> _mockMapper;

    public BloodStockServiceTests()
    {
        _mockRepo = new Mock<IBloodStockRepository>();
        _mockMapper = new Mock<IMapper>();
    }

    [Fact]
    public async Task UpdateStockUnitsAsync_ShouldThrowArgumentException_WhenUnitsAreNegative()
    {
        // Arrange
        var service = new BloodStockService(_mockRepo.Object, _mockMapper.Object);
        var dto = new UpdateStockDto { UnitsAvailable = -5 };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(() =>
            service.UpdateStockUnitsAsync(Guid.NewGuid(), dto));

        Assert.Contains("negative", exception.Message);
    }

    [Fact]
    public async Task UpdateStockUnitsAsync_ShouldThrowKeyNotFoundException_WhenItemDoesNotExist()
    {
        // Arrange
        var id = Guid.NewGuid();
        _mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((BloodStockItem?)null);
        var service = new BloodStockService(_mockRepo.Object, _mockMapper.Object);
        var dto = new UpdateStockDto { UnitsAvailable = 20 };

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            service.UpdateStockUnitsAsync(id, dto));
    }

    [Fact]
    public async Task UpdateStockUnitsAsync_ShouldUpdateUnits_WhenValid()
    {
        // Arrange
        var id = Guid.NewGuid();
        var item = new BloodStockItem
        {
            Id = id,
            BloodGroup = BloodGroup.O_POS,
            Component = ComponentType.WHOLE_BLOOD,
            UnitsAvailable = 10,
            StorageUnit = "Vault 1"
        };

        _mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(item);
        _mockRepo.Setup(r => r.UpdateAsync(It.IsAny<BloodStockItem>())).Returns(Task.CompletedTask);

        var service = new BloodStockService(_mockRepo.Object, _mockMapper.Object);
        var dto = new UpdateStockDto { UnitsAvailable = 45 };

        // Act
        var result = await service.UpdateStockUnitsAsync(id, dto);

        // Assert
        Assert.Equal(45, result.UnitsAvailable);
        _mockRepo.Verify(r => r.UpdateAsync(It.Is<BloodStockItem>(s => s.UnitsAvailable == 45)), Times.Once);
    }

    [Fact]
    public async Task ReserveStockUnitsAsync_ShouldCallRepoReserveUnitsAsync()
    {
        // Arrange
        var id = Guid.NewGuid();
        var item = new BloodStockItem
        {
            Id = id,
            BloodGroup = BloodGroup.A_POS,
            Component = ComponentType.PRBC,
            UnitsAvailable = 10,
            ReservedUnits = 5
        };

        _mockRepo.Setup(r => r.ReserveUnitsAsync(id, 2)).ReturnsAsync(item);

        var service = new BloodStockService(_mockRepo.Object, _mockMapper.Object);

        // Act
        var result = await service.ReserveStockUnitsAsync(id, 2);

        // Assert
        _mockRepo.Verify(r => r.ReserveUnitsAsync(id, 2), Times.Once);
    }
}
