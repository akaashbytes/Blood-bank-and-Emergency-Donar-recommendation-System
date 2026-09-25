using AutoMapper;
using LifeLink.Blood.Application.DTOs.BloodStock;
using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace LifeLink.Blood.Application.Services;

public class BloodStockService : IBloodStockService
{
    private readonly IBloodStockRepository _stockRepository;
    private readonly IMapper _mapper;

    public BloodStockService(
        IBloodStockRepository stockRepository,
        IMapper mapper)
    {
        _stockRepository = stockRepository;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<BloodStockItemDto>> GetStockAsync(
        string? bloodGroup,
        string? component,
        bool? belowThreshold)
    {
        var parsedGroup = ParseBloodGroup(bloodGroup);
        var parsedComponent = ParseComponentType(component);

        var itemsWithDist = await _stockRepository.GetStockAsync(
            parsedGroup,
            parsedComponent,
            belowThreshold,
            null,
            null,
            null);

        return itemsWithDist.Select(tuple => MapToDto(tuple.Item, tuple.DistanceMeters)).ToList();
    }

    public async Task<IReadOnlyList<BloodStockItemDto>> GetPublicStockAsync(
        string? bloodGroup,
        string? component,
        string? search,
        double? lat,
        double? lng,
        double? radiusKm)
    {
        var parsedGroup = ParseBloodGroup(bloodGroup);
        var parsedComponent = ParseComponentType(component);

        Point? searchLocation = null;
        if (lat.HasValue && lng.HasValue)
        {
            searchLocation = new Point(lng.Value, lat.Value) { SRID = 4326 };
        }

        var itemsWithDist = await _stockRepository.GetStockAsync(
            parsedGroup,
            parsedComponent,
            null,
            searchLocation,
            radiusKm,
            search);

        return itemsWithDist.Select(tuple => MapToDto(tuple.Item, tuple.DistanceMeters)).ToList();
    }

    public async Task<BloodStockItemDto> UpdateStockUnitsAsync(Guid id, UpdateStockDto dto)
    {
        if (dto.UnitsAvailable < 0)
        {
            throw new ArgumentException("Available blood stock units cannot be negative.");
        }

        var item = await _stockRepository.GetByIdAsync(id);
        if (item == null)
        {
            throw new KeyNotFoundException($"Blood stock item with ID '{id}' was not found.");
        }

        item.UnitsAvailable = dto.UnitsAvailable;
        item.LastUpdated = DateTime.UtcNow;

        try
        {
            await _stockRepository.UpdateAsync(item);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new InvalidOperationException("The blood stock item was modified by another user. Please reload and try again.");
        }

        return MapToDto(item, null);
    }

    public async Task<BloodStockItemDto> ReserveStockUnitsAsync(Guid id, int unitsToReserve)
    {
        if (unitsToReserve <= 0)
        {
            throw new ArgumentException("Units to reserve must be greater than zero.");
        }

        var item = await _stockRepository.ReserveUnitsAsync(id, unitsToReserve);
        return MapToDto(item, null);
    }

    private static BloodStockItemDto MapToDto(BloodStockItem item, double? distanceMeters)
    {
        return new BloodStockItemDto
        {
            Id = item.Id,
            BloodGroup = FormatBloodGroup(item.BloodGroup),
            Component = FormatComponentType(item.Component),
            UnitsAvailable = item.UnitsAvailable,
            ReservedUnits = item.ReservedUnits,
            CriticalThreshold = item.CriticalThreshold,
            LastUpdated = item.LastUpdated,
            ExpiryAlertsCount = item.ExpiryAlertsCount,
            StorageUnit = item.StorageUnit,
            Latitude = item.VaultLocation?.Y,
            Longitude = item.VaultLocation?.X,
            DistanceKm = distanceMeters.HasValue ? Math.Round(distanceMeters.Value / 1000.0, 1) : null
        };
    }

    private static BloodGroup? ParseBloodGroup(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return null;
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
            _ => Enum.TryParse<BloodGroup>(clean, out var res) ? res : null
        };
    }

    private static ComponentType? ParseComponentType(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return null;
        var clean = input.Trim().ToUpper();
        if (clean.Contains("WHOLE")) return ComponentType.WHOLE_BLOOD;
        if (clean.Contains("PRBC") || clean.Contains("RED")) return ComponentType.PRBC;
        if (clean.Contains("PLATELET")) return ComponentType.PLATELETS;
        if (clean.Contains("FFP") || clean.Contains("PLASMA")) return ComponentType.FFP;
        if (clean.Contains("CRYO")) return ComponentType.CRYOPRECIPITATE;
        return Enum.TryParse<ComponentType>(clean, out var res) ? res : null;
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
