using AutoMapper;
using LifeLink.Blood.Application.DTOs.DonorPledge;
using LifeLink.Blood.Application.DTOs.EmergencyRequest;
using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;
using LifeLink.Blood.Domain.Helpers;
using NetTopologySuite.Geometries;

namespace LifeLink.Blood.Application.Services;

public class EmergencyRequestService : IEmergencyRequestService
{
    private readonly IEmergencyRequestRepository _requestRepo;
    private readonly IDonorPledgeRepository _pledgeRepo;
    private readonly IDonorRepository _donorRepo;
    private readonly IBloodStockRepository _stockRepo;
    private readonly IAuditLogService _auditLogService;
    private readonly IMapper _mapper;

    public EmergencyRequestService(
        IEmergencyRequestRepository requestRepo,
        IDonorPledgeRepository pledgeRepo,
        IDonorRepository donorRepo,
        IBloodStockRepository stockRepo,
        IAuditLogService auditLogService,
        IMapper mapper)
    {
        _requestRepo = requestRepo;
        _pledgeRepo = pledgeRepo;
        _donorRepo = donorRepo;
        _stockRepo = stockRepo;
        _auditLogService = auditLogService;
        _mapper = mapper;
    }

    public async Task<EmergencyRequestDto> CreateRequestAsync(
        CreateEmergencyRequestDto dto,
        Guid requesterUserId,
        string requesterName,
        string requesterContact,
        string ipAddress)
    {
        if (dto.UnitsRequired <= 0)
        {
            throw new ArgumentException("Units required must be at least 1.");
        }

        var parsedGroup = ParseBloodGroup(dto.BloodGroup);
        var parsedComponent = ParseComponentType(dto.Component);
        var parsedUrgency = ParseUrgency(dto.Urgency);

        Point? location = null;
        if (dto.HospitalLatitude.HasValue && dto.HospitalLongitude.HasValue)
        {
            location = new Point(dto.HospitalLongitude.Value, dto.HospitalLatitude.Value) { SRID = 4326 };
        }

        var requestCode = $"EMG-{DateTime.UtcNow.Year}-{Random.Shared.Next(1000, 9999)}";

        var request = new EmergencyRequest
        {
            RequestCode = requestCode,
            PatientName = dto.PatientName,
            HospitalName = dto.HospitalName,
            City = dto.City,
            BloodGroup = parsedGroup,
            Component = parsedComponent,
            UnitsRequired = dto.UnitsRequired,
            UnitsAllocated = 0,
            Urgency = parsedUrgency,
            Status = RequestStatus.PENDING_VERIFICATION,
            RequesterId = requesterUserId,
            RequesterName = requesterName,
            RequesterContact = requesterContact,
            RequiredBy = string.IsNullOrWhiteSpace(dto.RequiredBy) ? "Immediate" : dto.RequiredBy,
            Notes = dto.Notes,
            HospitalLocation = location
        };

        await _requestRepo.AddAsync(request);

        await _auditLogService.LogAsync(
            requesterUserId,
            requesterName,
            UserRole.REQUESTER,
            "CREATE_EMERGENCY_REQUEST",
            "EMERGENCY_REQUESTS",
            ipAddress,
            $"Created emergency request {requestCode} for {dto.UnitsRequired} units of {parsedGroup} at {dto.HospitalName}.",
            AuditStatus.SUCCESS);

        return MapToDto(request);
    }

    public async Task<IReadOnlyList<EmergencyRequestDto>> GetRequestsAsync(
        Guid userId,
        UserRole role,
        string? statusFilter,
        BloodGroup? userBloodGroup)
    {
        RequestStatus? status = null;
        if (!string.IsNullOrWhiteSpace(statusFilter) && Enum.TryParse<RequestStatus>(statusFilter, true, out var parsedStatus))
        {
            status = parsedStatus;
        }

        bool isDonorView = (role == UserRole.DONOR);
        Guid? requesterIdFilter = (role == UserRole.REQUESTER) ? userId : null;

        var requests = await _requestRepo.GetRequestsAsync(requesterIdFilter, status, userBloodGroup, isDonorView);

        return requests.Select(MapToDto).ToList();
    }

    public async Task<EmergencyRequestDto> GetRequestByIdAsync(Guid id)
    {
        var request = await _requestRepo.GetWithDetailsAsync(id);
        if (request == null)
        {
            throw new KeyNotFoundException($"Emergency request with ID '{id}' was not found.");
        }
        return MapToDto(request);
    }

    public async Task<EmergencyRequestDto> GetRequestByCodeAsync(string requestCode)
    {
        var request = await _requestRepo.GetByCodeAsync(requestCode);
        if (request == null)
        {
            throw new KeyNotFoundException($"Emergency request with code '{requestCode}' was not found.");
        }
        return MapToDto(request);
    }

    public async Task<EmergencyRequestDto> UpdateRequestStatusAsync(
        Guid id,
        UpdateRequestStatusDto dto,
        Guid userId,
        string userDisplay,
        UserRole role,
        string ipAddress)
    {
        var request = await _requestRepo.GetWithDetailsAsync(id);
        if (request == null)
        {
            throw new KeyNotFoundException($"Emergency request with ID '{id}' was not found.");
        }

        if (!Enum.TryParse<RequestStatus>(dto.Status, true, out var newStatus))
        {
            throw new ArgumentException($"Invalid request status '{dto.Status}'.");
        }

        var oldStatus = request.Status;
        request.Status = newStatus;

        if (dto.UnitsAllocated.HasValue)
        {
            if (dto.UnitsAllocated.Value < 0)
            {
                throw new ArgumentException("Allocated units cannot be negative.");
            }
            request.UnitsAllocated = dto.UnitsAllocated.Value;
        }

        if (!string.IsNullOrWhiteSpace(dto.Notes))
        {
            request.Notes = string.IsNullOrWhiteSpace(request.Notes) ? dto.Notes : $"{request.Notes}\n[Update]: {dto.Notes}";
        }

        request.UpdatedAt = DateTime.UtcNow;
        await _requestRepo.UpdateAsync(request);

        await _auditLogService.LogAsync(
            userId,
            userDisplay,
            role,
            "UPDATE_REQUEST_STATUS",
            "EMERGENCY_REQUESTS",
            ipAddress,
            $"Updated status of request {request.RequestCode} from {oldStatus} to {newStatus}.",
            AuditStatus.SUCCESS);

        return MapToDto(request);
    }

    public async Task<IReadOnlyList<DonorCandidateMatchDto>> FindMatchingDonorsAsync(Guid requestId, double? radiusKm)
    {
        var request = await _requestRepo.GetByIdAsync(requestId);
        if (request == null)
        {
            throw new KeyNotFoundException($"Emergency request with ID '{requestId}' was not found.");
        }

        double searchRadius = radiusKm ?? 50.0;
        var matches = await _requestRepo.FindMatchingDonorsAsync(request.BloodGroup, request.HospitalLocation, searchRadius);

        return matches.Select(tuple => new DonorCandidateMatchDto
        {
            DonorRecordId = tuple.Donor.Id,
            DonorCode = tuple.Donor.DonorCode,
            FullName = tuple.Donor.FullName,
            BloodGroup = FormatBloodGroup(tuple.Donor.BloodGroup),
            City = tuple.Donor.City,
            Phone = tuple.Donor.Phone,
            Email = tuple.Donor.Email,
            DistanceKm = tuple.DistanceMeters.HasValue ? Math.Round(tuple.DistanceMeters.Value / 1000.0, 1) : null,
            TotalDonations = tuple.Donor.TotalDonations,
            Status = tuple.Donor.Status.ToString(),
            VerifiedBadge = tuple.Donor.VerifiedBadge
        }).ToList();
    }

    public async Task<DonorPledgeDto> PledgeDonorAsync(CreateDonorPledgeDto dto, Guid donorUserId, string ipAddress)
    {
        var request = await _requestRepo.GetByIdAsync(dto.EmergencyRequestId);
        if (request == null)
        {
            throw new KeyNotFoundException($"Emergency request with ID '{dto.EmergencyRequestId}' was not found.");
        }

        var donorRecord = await _donorRepo.GetByUserIdAsync(donorUserId);
        if (donorRecord == null)
        {
            throw new InvalidOperationException("You must have a registered donor profile to pledge blood.");
        }

        // Check compatibility
        if (!BloodGroupCompatibility.IsCompatible(donorRecord.BloodGroup, request.BloodGroup))
        {
            throw new InvalidOperationException($"Donor blood group {FormatBloodGroup(donorRecord.BloodGroup)} is not compatible with request blood group {FormatBloodGroup(request.BloodGroup)}.");
        }

        bool alreadyPledged = await _pledgeRepo.HasDonorPledgedAsync(request.Id, donorRecord.Id);
        if (alreadyPledged)
        {
            throw new InvalidOperationException("You have already submitted a pledge for this emergency request.");
        }

        var pledge = new DonorPledge
        {
            EmergencyRequestId = request.Id,
            DonorRecordId = donorRecord.Id,
            PreferredCenter = string.IsNullOrWhiteSpace(dto.PreferredCenter) ? request.HospitalName : dto.PreferredCenter,
            PreferredDate = dto.PreferredDate == default ? DateTime.UtcNow.AddDays(1) : DateTime.SpecifyKind(dto.PreferredDate, DateTimeKind.Utc),
            Status = "REGISTERED"
        };

        await _pledgeRepo.AddAsync(pledge);

        // Advance status to MATCH_FOUND if pending or in progress
        if (request.Status == RequestStatus.PENDING_VERIFICATION || request.Status == RequestStatus.IN_PROGRESS)
        {
            request.Status = RequestStatus.MATCH_FOUND;
            request.UpdatedAt = DateTime.UtcNow;
            await _requestRepo.UpdateAsync(request);
        }

        await _auditLogService.LogAsync(
            donorUserId,
            donorRecord.FullName,
            UserRole.DONOR,
            "DONOR_PLEDGE",
            "DONORS",
            ipAddress,
            $"Donor {donorRecord.DonorCode} pledged for emergency request {request.RequestCode}.",
            AuditStatus.SUCCESS);

        return new DonorPledgeDto
        {
            Id = pledge.Id,
            EmergencyRequestId = pledge.EmergencyRequestId,
            DonorRecordId = pledge.DonorRecordId,
            DonorCode = donorRecord.DonorCode,
            DonorName = donorRecord.FullName,
            BloodGroup = FormatBloodGroup(donorRecord.BloodGroup),
            PreferredCenter = pledge.PreferredCenter,
            PreferredDate = pledge.PreferredDate,
            Status = pledge.Status,
            CreatedAt = pledge.CreatedAt
        };
    }

    public async Task<EmergencyRequestDto> AllocateInventoryAsync(
        Guid requestId,
        AllocateBloodStockDto dto,
        Guid userId,
        string userDisplay,
        UserRole role,
        string ipAddress)
    {
        if (dto.UnitsToAllocate <= 0)
        {
            throw new ArgumentException("Units to allocate must be greater than 0.");
        }

        var request = await _requestRepo.GetWithDetailsAsync(requestId);
        if (request == null)
        {
            throw new KeyNotFoundException($"Emergency request with ID '{requestId}' was not found.");
        }

        var stockItem = await _stockRepo.GetByIdAsync(dto.BloodStockItemId);
        if (stockItem == null)
        {
            throw new KeyNotFoundException($"Blood stock item with ID '{dto.BloodStockItemId}' was not found.");
        }

        if (stockItem.BloodGroup != request.BloodGroup && !BloodGroupCompatibility.IsCompatible(stockItem.BloodGroup, request.BloodGroup))
        {
            throw new InvalidOperationException($"Stock blood group {FormatBloodGroup(stockItem.BloodGroup)} is not compatible with request blood group {FormatBloodGroup(request.BloodGroup)}.");
        }

        if (stockItem.UnitsAvailable < dto.UnitsToAllocate)
        {
            throw new InvalidOperationException($"Insufficient inventory available. Requested: {dto.UnitsToAllocate}, Available: {stockItem.UnitsAvailable}.");
        }

        // Deduct inventory transactionally using stockRepo reserve
        await _stockRepo.ReserveUnitsAsync(stockItem.Id, dto.UnitsToAllocate);

        request.UnitsAllocated += dto.UnitsToAllocate;
        if (request.UnitsAllocated >= request.UnitsRequired)
        {
            request.Status = RequestStatus.FULFILLED;
        }
        else
        {
            request.Status = RequestStatus.DISPATCHED;
        }

        request.UpdatedAt = DateTime.UtcNow;
        await _requestRepo.UpdateAsync(request);

        await _auditLogService.LogAsync(
            userId,
            userDisplay,
            role,
            "ALLOCATE_INVENTORY",
            "EMERGENCY_REQUESTS",
            ipAddress,
            $"Allocated {dto.UnitsToAllocate} units of {FormatBloodGroup(stockItem.BloodGroup)} stock to request {request.RequestCode}. Status updated to {request.Status}.",
            AuditStatus.SUCCESS);

        return MapToDto(request);
    }

    private static EmergencyRequestDto MapToDto(EmergencyRequest request)
    {
        return new EmergencyRequestDto
        {
            Id = request.Id,
            RequestCode = request.RequestCode,
            PatientName = request.PatientName,
            HospitalName = request.HospitalName,
            City = request.City,
            BloodGroup = FormatBloodGroup(request.BloodGroup),
            Component = FormatComponentType(request.Component),
            UnitsRequired = request.UnitsRequired,
            UnitsAllocated = request.UnitsAllocated,
            Urgency = request.Urgency.ToString(),
            Status = request.Status.ToString(),
            RequesterId = request.RequesterId,
            RequesterName = request.RequesterName,
            RequesterContact = request.RequesterContact,
            RequiredBy = request.RequiredBy,
            Notes = request.Notes,
            HospitalLatitude = request.HospitalLocation?.Y,
            HospitalLongitude = request.HospitalLocation?.X,
            CreatedAt = request.CreatedAt,
            UpdatedAt = request.UpdatedAt,
            PledgesCount = request.Pledges?.Count ?? 0,
            Pledges = request.Pledges?.Select(p => new DonorPledgeDto
            {
                Id = p.Id,
                EmergencyRequestId = p.EmergencyRequestId,
                DonorRecordId = p.DonorRecordId,
                DonorCode = p.DonorRecord?.DonorCode ?? string.Empty,
                DonorName = p.DonorRecord?.FullName ?? string.Empty,
                BloodGroup = p.DonorRecord != null ? FormatBloodGroup(p.DonorRecord.BloodGroup) : string.Empty,
                PreferredCenter = p.PreferredCenter,
                PreferredDate = p.PreferredDate,
                Status = p.Status,
                CreatedAt = p.CreatedAt
            }).ToList() ?? new List<DonorPledgeDto>()
        };
    }

    private static BloodGroup ParseBloodGroup(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return BloodGroup.O_POS;
        var clean = input.Trim().ToUpper().Replace(" ", "");
        return clean switch
        {
            "O+" or "O_POS" => BloodGroup.O_POS,
            "O-" or "O_NEG" => BloodGroup.O_NEG,
            "A+" or "A_POS" => BloodGroup.A_POS,
            "A-" or "A_NEG" => BloodGroup.A_NEG,
            "B+" or "B_POS" => BloodGroup.B_POS,
            "B-" or "B_NEG" => BloodGroup.B_NEG,
            "AB+" or "AB_POS" => BloodGroup.AB_POS,
            "AB-" or "AB_NEG" => BloodGroup.AB_NEG,
            _ => Enum.TryParse<BloodGroup>(clean, out var res) ? res : BloodGroup.O_POS
        };
    }

    private static ComponentType ParseComponentType(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return ComponentType.WHOLE_BLOOD;
        var clean = input.Trim().ToUpper();
        if (clean.Contains("PRBC") || clean.Contains("RED")) return ComponentType.PRBC;
        if (clean.Contains("PLATELET")) return ComponentType.PLATELETS;
        if (clean.Contains("FFP") || clean.Contains("PLASMA")) return ComponentType.FFP;
        if (clean.Contains("CRYO")) return ComponentType.CRYOPRECIPITATE;
        return Enum.TryParse<ComponentType>(clean, out var res) ? res : ComponentType.WHOLE_BLOOD;
    }

    private static RequestUrgency ParseUrgency(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return RequestUrgency.ROUTINE;
        var clean = input.Trim().ToUpper();
        if (clean.Contains("CRITICAL") || clean.Contains("EMERGENCY")) return RequestUrgency.CRITICAL_EMERGENCY;
        if (clean.Contains("HIGH")) return RequestUrgency.HIGH;
        return Enum.TryParse<RequestUrgency>(clean, out var res) ? res : RequestUrgency.ROUTINE;
    }

    private static string FormatBloodGroup(BloodGroup group)
    {
        return group switch
        {
            BloodGroup.O_POS => "O+",
            BloodGroup.O_NEG => "O-",
            BloodGroup.A_POS => "A+",
            BloodGroup.A_NEG => "A-",
            BloodGroup.B_POS => "B+",
            BloodGroup.B_NEG => "B-",
            BloodGroup.AB_POS => "AB+",
            BloodGroup.AB_NEG => "AB-",
            _ => group.ToString()
        };
    }

    private static string FormatComponentType(ComponentType component)
    {
        return component switch
        {
            ComponentType.WHOLE_BLOOD => "Whole Blood",
            ComponentType.PRBC => "PRBC (Red Cells)",
            ComponentType.PLATELETS => "Platelets",
            ComponentType.FFP => "FFP (Plasma)",
            ComponentType.CRYOPRECIPITATE => "Cryoprecipitate",
            _ => component.ToString()
        };
    }
}
