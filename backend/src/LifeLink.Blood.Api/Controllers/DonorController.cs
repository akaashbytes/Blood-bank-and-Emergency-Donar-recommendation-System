using System.Security.Claims;
using LifeLink.Blood.Application.DTOs.Donor;
using LifeLink.Blood.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeLink.Blood.Api.Controllers;

[ApiController]
[Route("api/v1/donors")]
public class DonorController : ControllerBase
{
    private readonly IDonorService _donorService;

    public DonorController(IDonorService donorService)
    {
        _donorService = donorService;
    }

    [HttpGet("me")]
    [Authorize(Policy = "DonorOnly")]
    public async Task<ActionResult<DonorRecordDto>> GetMyDonorProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var donorProfile = await _donorService.GetDonorByUserIdAsync(userId);
        if (donorProfile == null)
        {
            return NotFound(new ProblemDetails
            {
                Type = "https://lifelink.blood/errors/donor-not-found",
                Title = "Donor profile not found",
                Status = 404,
                Detail = "No registered donor profile exists for the current user account."
            });
        }

        return Ok(donorProfile);
    }

    [HttpGet]
    [Authorize(Policy = "CoordinatorOrAdmin")]
    public async Task<ActionResult<IReadOnlyList<DonorListItemDto>>> GetAllDonors()
    {
        var donors = await _donorService.GetAllDonorsAsync();
        return Ok(donors);
    }
}
