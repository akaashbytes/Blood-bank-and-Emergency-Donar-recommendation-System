using System.Security.Claims;
using LifeLink.Blood.Application.DTOs.DonorPledge;
using LifeLink.Blood.Application.DTOs.EmergencyRequest;
using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeLink.Blood.Api.Controllers;

[ApiController]
[Route("api/v1/requests")]
public class EmergencyRequestController : ControllerBase
{
    private readonly IEmergencyRequestService _requestService;

    public EmergencyRequestController(IEmergencyRequestService requestService)
    {
        _requestService = requestService;
    }

    [HttpPost]
    [Authorize(Roles = "REQUESTER,COORDINATOR,ADMIN")]
    public async Task<ActionResult<EmergencyRequestDto>> CreateRequest([FromBody] CreateEmergencyRequestDto dto)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue) return Unauthorized();

        var userName = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst("name")?.Value ?? "Requester User";
        var userContact = User.FindFirst(ClaimTypes.MobilePhone)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "+91 99000 00000";
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";

        try
        {
            var result = await _requestService.CreateRequestAsync(dto, userId.Value, userName, userContact, ipAddress);
            return CreatedAtAction(nameof(GetRequestById), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ProblemDetails { Title = "Invalid Request Data", Status = 400, Detail = ex.Message });
        }
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IReadOnlyList<EmergencyRequestDto>>> GetRequests([FromQuery] string? status)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue) return Unauthorized();

        var roleStr = User.FindFirst(ClaimTypes.Role)?.Value ?? "DONOR";
        Enum.TryParse<UserRole>(roleStr, true, out var role);

        BloodGroup? userBloodGroup = null;
        var bgClaim = User.FindFirst("bloodGroup")?.Value;
        if (!string.IsNullOrWhiteSpace(bgClaim) && Enum.TryParse<BloodGroup>(bgClaim, true, out var bg))
        {
            userBloodGroup = bg;
        }

        var requests = await _requestService.GetRequestsAsync(userId.Value, role, status, userBloodGroup);
        return Ok(requests);
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<EmergencyRequestDto>> GetRequestById(Guid id)
    {
        try
        {
            var request = await _requestService.GetRequestByIdAsync(id);
            return Ok(request);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ProblemDetails { Title = "Request Not Found", Status = 404, Detail = ex.Message });
        }
    }

    [HttpGet("track/{requestCode}")]
    [AllowAnonymous]
    public async Task<ActionResult<EmergencyRequestDto>> TrackRequest(string requestCode)
    {
        try
        {
            var request = await _requestService.GetRequestByCodeAsync(requestCode);
            return Ok(request);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ProblemDetails { Title = "Request Code Not Found", Status = 404, Detail = ex.Message });
        }
    }

    [HttpPut("{id:guid}/status")]
    [Authorize(Policy = "CoordinatorOrAdmin")]
    public async Task<ActionResult<EmergencyRequestDto>> UpdateRequestStatus(Guid id, [FromBody] UpdateRequestStatusDto dto)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue) return Unauthorized();

        var userDisplay = GetUserDisplay();
        var role = GetUserRole();
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";

        try
        {
            var updated = await _requestService.UpdateRequestStatusAsync(id, dto, userId.Value, userDisplay, role, ipAddress);
            return Ok(updated);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ProblemDetails { Title = "Request Not Found", Status = 404, Detail = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ProblemDetails { Title = "Invalid Update Data", Status = 400, Detail = ex.Message });
        }
    }

    [HttpGet("{id:guid}/matching-donors")]
    [Authorize(Policy = "CoordinatorOrAdmin")]
    public async Task<ActionResult<IReadOnlyList<DonorCandidateMatchDto>>> GetMatchingDonors(Guid id, [FromQuery] double? radiusKm)
    {
        try
        {
            var candidates = await _requestService.FindMatchingDonorsAsync(id, radiusKm);
            return Ok(candidates);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ProblemDetails { Title = "Request Not Found", Status = 404, Detail = ex.Message });
        }
    }

    [HttpPost("{id:guid}/pledge")]
    [Authorize(Roles = "DONOR")]
    public async Task<ActionResult<DonorPledgeDto>> PledgeForRequest(Guid id, [FromBody] CreateDonorPledgeDto dto)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue) return Unauthorized();

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        dto.EmergencyRequestId = id;

        try
        {
            var pledge = await _requestService.PledgeDonorAsync(dto, userId.Value, ipAddress);
            return Ok(pledge);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ProblemDetails { Title = "Not Found", Status = 404, Detail = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ProblemDetails { Title = "Pledge Failed", Status = 400, Detail = ex.Message });
        }
    }

    [HttpPost("/api/v1/donors/pledge")]
    [Authorize(Roles = "DONOR")]
    public async Task<ActionResult<DonorPledgeDto>> DonorPledgeAlias([FromBody] CreateDonorPledgeDto dto)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue) return Unauthorized();

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";

        try
        {
            var pledge = await _requestService.PledgeDonorAsync(dto, userId.Value, ipAddress);
            return Ok(pledge);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ProblemDetails { Title = "Not Found", Status = 404, Detail = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ProblemDetails { Title = "Pledge Failed", Status = 400, Detail = ex.Message });
        }
    }

    [HttpPost("{id:guid}/allocate")]
    [Authorize(Policy = "CoordinatorOrAdmin")]
    public async Task<ActionResult<EmergencyRequestDto>> AllocateStock(Guid id, [FromBody] AllocateBloodStockDto dto)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue) return Unauthorized();

        var userDisplay = GetUserDisplay();
        var role = GetUserRole();
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";

        try
        {
            var updatedRequest = await _requestService.AllocateInventoryAsync(id, dto, userId.Value, userDisplay, role, ipAddress);
            return Ok(updatedRequest);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ProblemDetails { Title = "Not Found", Status = 404, Detail = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ProblemDetails { Title = "Allocation Conflict", Status = 409, Detail = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ProblemDetails { Title = "Invalid Allocation", Status = 400, Detail = ex.Message });
        }
    }

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }

    private string GetUserDisplay()
    {
        return User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst("name")?.Value ?? "User";
    }

    private UserRole GetUserRole()
    {
        var roleStr = User.FindFirst(ClaimTypes.Role)?.Value ?? "COORDINATOR";
        return Enum.TryParse<UserRole>(roleStr, true, out var r) ? r : UserRole.COORDINATOR;
    }
}
