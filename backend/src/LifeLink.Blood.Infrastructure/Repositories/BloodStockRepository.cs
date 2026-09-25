using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;
using LifeLink.Blood.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace LifeLink.Blood.Infrastructure.Repositories;

public class BloodStockRepository : GenericRepository<BloodStockItem>, IBloodStockRepository
{
    public BloodStockRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<(BloodStockItem Item, double? DistanceMeters)>> GetStockAsync(
        BloodGroup? bloodGroup,
        ComponentType? component,
        bool? belowThreshold,
        Point? searchLocation,
        double? radiusKm,
        string? search)
    {
        IQueryable<BloodStockItem> query = _context.BloodStockItems;

        if (bloodGroup.HasValue)
        {
            query = query.Where(s => s.BloodGroup == bloodGroup.Value);
        }

        if (component.HasValue)
        {
            query = query.Where(s => s.Component == component.Value);
        }

        if (belowThreshold.HasValue && belowThreshold.Value)
        {
            query = query.Where(s => s.UnitsAvailable < s.CriticalThreshold);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(s => s.StorageUnit.ToLower().Contains(searchLower) ||
                                     s.BloodGroup.ToString().ToLower().Contains(searchLower) ||
                                     s.Component.ToString().ToLower().Contains(searchLower));
        }

        if (searchLocation != null)
        {
            var radiusMeters = (radiusKm ?? 50.0) * 1000.0;
            query = query.Where(s => s.VaultLocation != null && s.VaultLocation.IsWithinDistance(searchLocation, radiusMeters));
        }

        var items = await query.ToListAsync();

        var result = new List<(BloodStockItem Item, double? DistanceMeters)>();
        foreach (var item in items)
        {
            double? dist = null;
            if (searchLocation != null && item.VaultLocation != null)
            {
                dist = searchLocation.Distance(item.VaultLocation);
            }
            result.Add((item, dist));
        }

        if (searchLocation != null)
        {
            result = result.OrderBy(r => r.DistanceMeters ?? double.MaxValue).ToList();
        }

        return result;
    }

    public async Task<BloodStockItem> ReserveUnitsAsync(Guid id, int unitsToReserve)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var item = await _context.BloodStockItems.FindAsync(id);
            if (item == null)
            {
                throw new KeyNotFoundException($"Blood stock item with ID '{id}' was not found.");
            }

            if (item.UnitsAvailable < unitsToReserve)
            {
                throw new InvalidOperationException($"Insufficient stock available. Requested: {unitsToReserve}, Available: {item.UnitsAvailable}.");
            }

            item.UnitsAvailable -= unitsToReserve;
            item.ReservedUnits += unitsToReserve;
            item.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return item;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
