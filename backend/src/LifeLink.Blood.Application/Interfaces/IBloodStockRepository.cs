using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;
using NetTopologySuite.Geometries;

namespace LifeLink.Blood.Application.Interfaces;

public interface IBloodStockRepository : IGenericRepository<BloodStockItem>
{
    Task<IReadOnlyList<(BloodStockItem Item, double? DistanceMeters)>> GetStockAsync(
        BloodGroup? bloodGroup,
        ComponentType? component,
        bool? belowThreshold,
        Point? searchLocation,
        double? radiusKm,
        string? search);

    Task<BloodStockItem> ReserveUnitsAsync(Guid id, int unitsToReserve);
}
