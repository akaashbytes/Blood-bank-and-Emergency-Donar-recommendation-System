using LifeLink.Blood.Application.DTOs.ExpiryAlert;
using LifeLink.Blood.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeLink.Blood.Api.Controllers;

[ApiController]
[Route("api/v1/expiry-alerts")]
public class ExpiryAlertController : ControllerBase
{
    private readonly IExpiryAlertService _expiryService;

    public ExpiryAlertController(IExpiryAlertService expiryService)
    {
        _expiryService = expiryService;
    }

    [HttpGet]
    [Authorize(Policy = "CoordinatorOrAdmin")]
    public async Task<ActionResult<IReadOnlyList<ExpiryAlertDto>>> GetExpiryAlerts([FromQuery] string? status)
    {
        var alerts = await _expiryService.GetExpiryAlertsAsync(status);
        return Ok(alerts);
    }
}
