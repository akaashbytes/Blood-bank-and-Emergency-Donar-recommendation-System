using LifeLink.Blood.Application.DTOs.BloodStock;

namespace LifeLink.Blood.Application.Interfaces;

public interface IBloodStockService
{
    Task<IReadOnlyList<BloodStockItemDto>> GetStockAsync(
        string? bloodGroup,
        string? component,
        bool? belowThreshold);

    Task<IReadOnlyList<BloodStockItemDto>> GetPublicStockAsync(
        string? bloodGroup,
        string? component,
        string? search,
        double? lat,
        double? lng,
        double? radiusKm);

    Task<BloodStockItemDto> UpdateStockUnitsAsync(Guid id, UpdateStockDto dto);

    Task<BloodStockItemDto> ReserveStockUnitsAsync(Guid id, int unitsToReserve);
}
