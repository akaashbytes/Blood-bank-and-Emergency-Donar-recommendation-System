using LifeLink.Blood.Application.DTOs.BloodStock;
using LifeLink.Blood.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeLink.Blood.Api.Controllers;

[ApiController]
[Route("api/v1/stock")]
public class BloodStockController : ControllerBase
{
    private readonly IBloodStockService _stockService;

    public BloodStockController(IBloodStockService stockService)
    {
        _stockService = stockService;
    }

    [HttpGet]
    [Authorize(Policy = "CoordinatorOrAdmin")]
    public async Task<ActionResult<IReadOnlyList<BloodStockItemDto>>> GetStock(
        [FromQuery] string? bloodGroup,
        [FromQuery] string? component,
        [FromQuery] bool? belowThreshold)
    {
        var result = await _stockService.GetStockAsync(bloodGroup, component, belowThreshold);
        return Ok(result);
    }

    [HttpGet("public")]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<BloodStockItemDto>>> GetPublicStock(
        [FromQuery] string? bloodGroup,
        [FromQuery] string? component,
        [FromQuery] string? search,
        [FromQuery] double? lat,
        [FromQuery] double? lng,
        [FromQuery] double? radiusKm)
    {
        var result = await _stockService.GetPublicStockAsync(
            bloodGroup,
            component,
            search,
            lat,
            lng,
            radiusKm);

        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "CoordinatorOrAdmin")]
    public async Task<ActionResult<BloodStockItemDto>> UpdateStockUnits(
        [FromRoute] Guid id,
        [FromBody] UpdateStockDto dto)
    {
        var updated = await _stockService.UpdateStockUnitsAsync(id, dto);
        return Ok(updated);
    }
}
