using LifeLink.Blood.Application.DTOs.DonorPledge;
using LifeLink.Blood.Application.DTOs.EmergencyRequest;
using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Application.Services;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;
using Moq;
using NetTopologySuite.Geometries;
using Xunit;

namespace LifeLink.Blood.Application.Tests;

public class EmergencyRequestServiceTests
{
    private readonly Mock<IEmergencyRequestRepository> _mockRequestRepo;
    private readonly Mock<IDonorPledgeRepository> _mockPledgeRepo;
    private readonly Mock<IDonorRepository> _mockDonorRepo;
    private readonly Mock<IBloodStockRepository> _mockStockRepo;
    private readonly Mock<IAuditLogService> _mockAuditService;
    private readonly EmergencyRequestService _service;

    public EmergencyRequestServiceTests()
    {
        _mockRequestRepo = new Mock<IEmergencyRequestRepository>();
        _mockPledgeRepo = new Mock<IDonorPledgeRepository>();
        _mockDonorRepo = new Mock<IDonorRepository>();
        _mockStockRepo = new Mock<IBloodStockRepository>();
        _mockAuditService = new Mock<IAuditLogService>();

        _service = new EmergencyRequestService(
            _mockRequestRepo.Object,
            _mockPledgeRepo.Object,
            _mockDonorRepo.Object,
            _mockStockRepo.Object,
            _mockAuditService.Object,
            null!);
    }

    [Fact]
    public async Task CreateRequestAsync_ShouldCreateEmergencyRequest_WhenValid()
    {
        // Arrange
        var dto = new CreateEmergencyRequestDto
        {
            PatientName = "Test Patient",
            HospitalName = "City Hospital",
            City = "New Delhi",
            BloodGroup = "O+",
            Component = "PRBC",
            UnitsRequired = 3,
            Urgency = "HIGH"
        };

        _mockRequestRepo.Setup(r => r.AddAsync(It.IsAny<EmergencyRequest>())).ReturnsAsync((EmergencyRequest req) => req);

        // Act
        var result = await _service.CreateRequestAsync(dto, Guid.NewGuid(), "Dr. Test", "+91 99999", "127.0.0.1");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Patient", result.PatientName);
        Assert.Equal("O+", result.BloodGroup);
        Assert.Equal(3, result.UnitsRequired);
        Assert.Equal("PENDING_VERIFICATION", result.Status);

        _mockRequestRepo.Verify(r => r.AddAsync(It.IsAny<EmergencyRequest>()), Times.Once);
        _mockAuditService.Verify(a => a.LogAsync(
            It.IsAny<Guid?>(),
            It.IsAny<string>(),
            UserRole.REQUESTER,
            "CREATE_EMERGENCY_REQUEST",
            "EMERGENCY_REQUESTS",
            It.IsAny<string>(),
            It.IsAny<string>(),
            AuditStatus.SUCCESS), Times.Once);
    }

    [Fact]
    public async Task PledgeDonorAsync_ShouldThrowInvalidOperationException_WhenIncompatibleBloodGroup()
    {
        // Arrange
        var requestId = Guid.NewGuid();
        var donorUserId = Guid.NewGuid();

        var request = new EmergencyRequest
        {
            Id = requestId,
            BloodGroup = BloodGroup.O_NEG // O- recipient can only receive O-
        };

        var donorRecord = new DonorRecord
        {
            Id = Guid.NewGuid(),
            UserId = donorUserId,
            BloodGroup = BloodGroup.A_POS // A+ donor is incompatible
        };

        _mockRequestRepo.Setup(r => r.GetByIdAsync(requestId)).ReturnsAsync(request);
        _mockDonorRepo.Setup(d => d.GetByUserIdAsync(donorUserId)).ReturnsAsync(donorRecord);

        var dto = new CreateDonorPledgeDto { EmergencyRequestId = requestId };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.PledgeDonorAsync(dto, donorUserId, "127.0.0.1"));

        Assert.Contains("not compatible", ex.Message);
    }

    [Fact]
    public async Task AllocateInventoryAsync_ShouldAllocateStockAndUpdateStatusToFulfilled()
    {
        // Arrange
        var requestId = Guid.NewGuid();
        var stockId = Guid.NewGuid();

        var request = new EmergencyRequest
        {
            Id = requestId,
            RequestCode = "EMG-100",
            BloodGroup = BloodGroup.O_POS,
            UnitsRequired = 2,
            UnitsAllocated = 0,
            Status = RequestStatus.IN_PROGRESS
        };

        var stockItem = new BloodStockItem
        {
            Id = stockId,
            BloodGroup = BloodGroup.O_POS,
            UnitsAvailable = 10
        };

        _mockRequestRepo.Setup(r => r.GetWithDetailsAsync(requestId)).ReturnsAsync(request);
        _mockStockRepo.Setup(s => s.GetByIdAsync(stockId)).ReturnsAsync(stockItem);
        _mockStockRepo.Setup(s => s.ReserveUnitsAsync(stockId, 2)).ReturnsAsync(stockItem);
        _mockRequestRepo.Setup(r => r.UpdateAsync(It.IsAny<EmergencyRequest>())).Returns(Task.CompletedTask);

        var dto = new AllocateBloodStockDto
        {
            BloodStockItemId = stockId,
            UnitsToAllocate = 2
        };

        // Act
        var result = await _service.AllocateInventoryAsync(requestId, dto, Guid.NewGuid(), "Coordinator", UserRole.COORDINATOR, "127.0.0.1");

        // Assert
        Assert.Equal(2, result.UnitsAllocated);
        Assert.Equal("FULFILLED", result.Status);

        _mockStockRepo.Verify(s => s.ReserveUnitsAsync(stockId, 2), Times.Once);
        _mockAuditService.Verify(a => a.LogAsync(
            It.IsAny<Guid?>(),
            It.IsAny<string>(),
            UserRole.COORDINATOR,
            "ALLOCATE_INVENTORY",
            "EMERGENCY_REQUESTS",
            It.IsAny<string>(),
            It.IsAny<string>(),
            AuditStatus.SUCCESS), Times.Once);
    }

    [Fact]
    public async Task FindMatchingDonorsAsync_ShouldReturnDonorCandidatesWithDistance_ExcludingHealthMetrics()
    {
        // Arrange
        var requestId = Guid.NewGuid();
        var request = new EmergencyRequest
        {
            Id = requestId,
            BloodGroup = BloodGroup.O_POS,
            HospitalLocation = new Point(77.2100, 28.5672) { SRID = 4326 }
        };

        var donor = new DonorRecord
        {
            Id = Guid.NewGuid(),
            DonorCode = "LIFELINK-D-01",
            FullName = "Donor Candidate",
            BloodGroup = BloodGroup.O_POS,
            City = "Delhi",
            Phone = "+91 99999",
            Email = "donor@test.com",
            Status = DonorStatus.ELIGIBLE,
            TotalDonations = 5,
            VerifiedBadge = true
        };

        _mockRequestRepo.Setup(r => r.GetByIdAsync(requestId)).ReturnsAsync(request);
        _mockRequestRepo.Setup(r => r.FindMatchingDonorsAsync(BloodGroup.O_POS, request.HospitalLocation, 50.0))
            .ReturnsAsync(new List<(DonorRecord Donor, double? DistanceMeters)> { (donor, 2500.0) });

        // Act
        var candidates = await _service.FindMatchingDonorsAsync(requestId, 50.0);

        // Assert
        Assert.Single(candidates);
        Assert.Equal("Donor Candidate", candidates[0].FullName);
        Assert.Equal(2.5, candidates[0].DistanceKm);
    }
}
