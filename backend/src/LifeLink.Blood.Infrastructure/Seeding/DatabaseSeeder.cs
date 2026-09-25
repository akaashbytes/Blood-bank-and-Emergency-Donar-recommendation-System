using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;
using LifeLink.Blood.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace LifeLink.Blood.Infrastructure.Seeding;

public class DatabaseSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public DatabaseSeeder(ApplicationDbContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task SeedAsync()
    {
        if (!await _context.Users.AnyAsync())
        {
            var hashedPassword = _passwordHasher.HashPassword("Password123!");

            var donorUser = new User
            {
                Name = "Ananya Sharma",
                Email = "ananya.donor@lifelink.org",
                PasswordHash = hashedPassword,
                Role = UserRole.DONOR,
                Phone = "+91 98765 43210",
                BloodGroup = BloodGroup.O_POS,
                City = "New Delhi",
                Location = new Point(77.2090, 28.6139) { SRID = 4326 },
                IsActive = true
            };

            var requesterUser = new User
            {
                Name = "Dr. Rajesh Kumar",
                Email = "dr.rajesh@aiims.edu",
                PasswordHash = hashedPassword,
                Role = UserRole.REQUESTER,
                Phone = "+91 98112 34567",
                InstitutionName = "AIIMS Emergency Trauma Center",
                City = "New Delhi",
                Location = new Point(77.2100, 28.5672) { SRID = 4326 },
                IsActive = true
            };

            var coordinatorUser = new User
            {
                Name = "Sunita Verma",
                Email = "sunita.v@bloodbank.gov.in",
                PasswordHash = hashedPassword,
                Role = UserRole.COORDINATOR,
                Phone = "+91 99001 12233",
                InstitutionName = "Central Regional Blood Center #4",
                City = "New Delhi",
                Location = new Point(77.2090, 28.6139) { SRID = 4326 },
                IsActive = true
            };

            var adminUser = new User
            {
                Name = "System Administrator",
                Email = "admin@lifelink.gov.in",
                PasswordHash = hashedPassword,
                Role = UserRole.ADMIN,
                Phone = "+91 11 2345 6789",
                InstitutionName = "National Blood Transfusion Council",
                City = "New Delhi",
                Location = new Point(77.2090, 28.6139) { SRID = 4326 },
                IsActive = true
            };

            _context.Users.AddRange(donorUser, requesterUser, coordinatorUser, adminUser);
            await _context.SaveChangesAsync();

            var donorRecord = new DonorRecord
            {
                UserId = donorUser.Id,
                DonorCode = "LIFELINK-D-9901",
                FullName = donorUser.Name,
                BloodGroup = BloodGroup.O_POS,
                Age = 28,
                Gender = "Female",
                City = "New Delhi",
                Phone = donorUser.Phone!,
                Email = donorUser.Email,
                LastDonatedDate = DateTime.UtcNow.AddMonths(-4),
                NextEligibleDate = DateTime.UtcNow.AddDays(-10),
                TotalDonations = 7,
                Status = DonorStatus.ELIGIBLE,
                VerifiedBadge = true,
                Location = new Point(77.2090, 28.6139) { SRID = 4326 }
            };

            _context.DonorRecords.Add(donorRecord);
            await _context.SaveChangesAsync();

            var healthMetrics = new DonorHealthMetrics
            {
                DonorRecordId = donorRecord.Id,
                WeightKg = 62.5m,
                Hemoglobin = 13.8m,
                BloodPressure = "120/80",
                RecordedAt = DateTime.UtcNow
            };

            _context.DonorHealthMetrics.Add(healthMetrics);
            await _context.SaveChangesAsync();
        }

        if (!await _context.BloodStockItems.AnyAsync())
        {
            var vaultPoint = new Point(77.2090, 28.6139) { SRID = 4326 };

            var stk1 = new BloodStockItem { BloodGroup = BloodGroup.O_POS, Component = ComponentType.WHOLE_BLOOD, UnitsAvailable = 48, ReservedUnits = 12, CriticalThreshold = 15, StorageUnit = "Vault A-1", ExpiryAlertsCount = 2, VaultLocation = vaultPoint };
            var stk2 = new BloodStockItem { BloodGroup = BloodGroup.A_POS, Component = ComponentType.PRBC, UnitsAvailable = 32, ReservedUnits = 8, CriticalThreshold = 10, StorageUnit = "Vault A-2", ExpiryAlertsCount = 0, VaultLocation = vaultPoint };
            var stk3 = new BloodStockItem { BloodGroup = BloodGroup.B_POS, Component = ComponentType.FFP, UnitsAvailable = 24, ReservedUnits = 4, CriticalThreshold = 10, StorageUnit = "Vault B-1", ExpiryAlertsCount = 1, VaultLocation = vaultPoint };
            var stk4 = new BloodStockItem { BloodGroup = BloodGroup.AB_POS, Component = ComponentType.PLATELETS, UnitsAvailable = 18, ReservedUnits = 6, CriticalThreshold = 8, StorageUnit = "Vault B-2", ExpiryAlertsCount = 0, VaultLocation = vaultPoint };
            var stk5 = new BloodStockItem { BloodGroup = BloodGroup.O_NEG, Component = ComponentType.WHOLE_BLOOD, UnitsAvailable = 6, ReservedUnits = 4, CriticalThreshold = 15, StorageUnit = "Vault C-1", ExpiryAlertsCount = 1, VaultLocation = vaultPoint };
            var stk6 = new BloodStockItem { BloodGroup = BloodGroup.A_NEG, Component = ComponentType.PRBC, UnitsAvailable = 8, ReservedUnits = 2, CriticalThreshold = 10, StorageUnit = "Vault C-2", ExpiryAlertsCount = 0, VaultLocation = vaultPoint };
            var stk7 = new BloodStockItem { BloodGroup = BloodGroup.B_NEG, Component = ComponentType.FFP, UnitsAvailable = 12, ReservedUnits = 3, CriticalThreshold = 8, StorageUnit = "Vault D-1", ExpiryAlertsCount = 0, VaultLocation = vaultPoint };
            var stk8 = new BloodStockItem { BloodGroup = BloodGroup.AB_NEG, Component = ComponentType.CRYOPRECIPITATE, UnitsAvailable = 5, ReservedUnits = 2, CriticalThreshold = 5, StorageUnit = "Vault D-2", ExpiryAlertsCount = 0, VaultLocation = vaultPoint };

            _context.BloodStockItems.AddRange(stk1, stk2, stk3, stk4, stk5, stk6, stk7, stk8);
            await _context.SaveChangesAsync();

            var now = DateTime.UtcNow;
            var exp1 = new ExpiryAlert { BloodStockItemId = stk5.Id, UnitId = "U-O-NEG-901", BloodGroup = BloodGroup.O_NEG, Component = ComponentType.PRBC, QuantityUnits = 2, ExpiryDate = now.AddDays(1), DaysRemaining = 1, Status = ExpiryAlertStatus.CRITICAL_24H, Location = "Vault A-2 (Rack 4)" };
            var exp2 = new ExpiryAlert { BloodStockItemId = stk2.Id, UnitId = "U-A-POS-412", BloodGroup = BloodGroup.A_POS, Component = ComponentType.WHOLE_BLOOD, QuantityUnits = 5, ExpiryDate = now.AddDays(2), DaysRemaining = 2, Status = ExpiryAlertStatus.WARNING_72H, Location = "Vault B-1 (Rack 2)" };
            var exp3 = new ExpiryAlert { BloodStockItemId = stk3.Id, UnitId = "U-B-POS-882", BloodGroup = BloodGroup.B_POS, Component = ComponentType.PLATELETS, QuantityUnits = 1, ExpiryDate = now.AddHours(-2), DaysRemaining = 0, Status = ExpiryAlertStatus.EXPIRED, Location = "Vault C-3 (Rack 1)" };
            var exp4 = new ExpiryAlert { BloodStockItemId = stk8.Id, UnitId = "U-AB-NEG-104", BloodGroup = BloodGroup.AB_NEG, Component = ComponentType.FFP, QuantityUnits = 3, ExpiryDate = now.AddDays(3), DaysRemaining = 3, Status = ExpiryAlertStatus.WARNING_72H, Location = "Vault D-2 (Rack 5)" };

            _context.ExpiryAlerts.AddRange(exp1, exp2, exp3, exp4);
            await _context.SaveChangesAsync();
        }

        if (!await _context.EmergencyRequests.AnyAsync())
        {
            var requester = await _context.Users.FirstOrDefaultAsync(u => u.Role == UserRole.REQUESTER);
            var hospitalLocation = new Point(77.2100, 28.5672) { SRID = 4326 };

            var req1 = new EmergencyRequest
            {
                RequestCode = "EMG-2026-9001",
                PatientName = "Rohit Malhotra",
                HospitalName = "AIIMS Emergency Trauma Center",
                City = "New Delhi",
                BloodGroup = BloodGroup.O_POS,
                Component = ComponentType.PRBC,
                UnitsRequired = 4,
                UnitsAllocated = 0,
                Urgency = RequestUrgency.CRITICAL_EMERGENCY,
                Status = RequestStatus.PENDING_VERIFICATION,
                RequesterId = requester?.Id,
                RequesterName = requester?.Name ?? "Dr. Rajesh Kumar",
                RequesterContact = requester?.Phone ?? "+91 98112 34567",
                RequiredBy = "Immediate (< 1 Hour)",
                Notes = "Major polytrauma road accident case.",
                HospitalLocation = hospitalLocation
            };

            var req2 = new EmergencyRequest
            {
                RequestCode = "EMG-2026-9002",
                PatientName = "Kavita Devi",
                HospitalName = "Safdarjung Emergency Wing",
                City = "New Delhi",
                BloodGroup = BloodGroup.A_POS,
                Component = ComponentType.WHOLE_BLOOD,
                UnitsRequired = 2,
                UnitsAllocated = 2,
                Urgency = RequestUrgency.HIGH,
                Status = RequestStatus.DISPATCHED,
                RequesterId = requester?.Id,
                RequesterName = requester?.Name ?? "Dr. Rajesh Kumar",
                RequesterContact = requester?.Phone ?? "+91 98112 34567",
                RequiredBy = "Within 4 Hours",
                Notes = "Scheduled cardiac surgery case.",
                HospitalLocation = hospitalLocation
            };

            _context.EmergencyRequests.AddRange(req1, req2);
            await _context.SaveChangesAsync();

            var audit1 = new AuditLog
            {
                UserId = requester?.Id,
                UserDisplay = requester?.Name ?? "Dr. Rajesh Kumar",
                Role = UserRole.REQUESTER,
                Action = "CREATE_EMERGENCY_REQUEST",
                Module = "EMERGENCY_REQUESTS",
                IpAddress = "127.0.0.1",
                Details = "Created emergency request EMG-2026-9001 for 4 units of O+ PRBC.",
                Status = AuditStatus.SUCCESS
            };

            _context.AuditLogs.Add(audit1);
            await _context.SaveChangesAsync();
        }
    }
}
