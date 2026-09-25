using AutoMapper;
using LifeLink.Blood.Application.DTOs.ExpiryAlert;
using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;
using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Application.Services;

public class ExpiryAlertService : IExpiryAlertService
{
    private readonly IExpiryAlertRepository _alertRepository;
    private readonly IMapper _mapper;

    public ExpiryAlertService(IExpiryAlertRepository alertRepository, IMapper mapper)
    {
        _alertRepository = alertRepository;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<ExpiryAlertDto>> GetExpiryAlertsAsync(string? status)
    {
        var parsedStatus = ParseAlertStatus(status);
        var alerts = await _alertRepository.GetAlertsAsync(parsedStatus);

        return alerts.Select(MapToDto).ToList();
    }

    public async Task ProcessExpiryAlertsAsync()
    {
        var alerts = await _alertRepository.GetAllAsync();
        var now = DateTime.UtcNow;

        foreach (var alert in alerts)
        {
            var diffDays = (int)Math.Ceiling((alert.ExpiryDate - now).TotalDays);
            alert.DaysRemaining = Math.Max(0, diffDays);

            if (diffDays <= 0)
            {
                alert.Status = ExpiryAlertStatus.EXPIRED;
            }
            else if (diffDays <= 1)
            {
                alert.Status = ExpiryAlertStatus.CRITICAL_24H;
            }
            else if (diffDays <= 3)
            {
                alert.Status = ExpiryAlertStatus.WARNING_72H;
            }

            await _alertRepository.UpdateAsync(alert);
        }
    }

    private static ExpiryAlertDto MapToDto(ExpiryAlert alert)
    {
        return new ExpiryAlertDto
        {
            Id = alert.Id,
            UnitId = alert.UnitId,
            BloodGroup = FormatBloodGroup(alert.BloodGroup),
            Component = FormatComponentType(alert.Component),
            QuantityUnits = alert.QuantityUnits,
            ExpiryDate = alert.ExpiryDate,
            DaysRemaining = alert.DaysRemaining,
            Status = alert.Status.ToString(),
            Location = alert.Location
        };
    }

    private static ExpiryAlertStatus? ParseAlertStatus(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return null;
        var clean = input.Trim().ToUpper();
        return clean switch
        {
            "CRITICAL_24H" or "24H" or "CRITICAL" => ExpiryAlertStatus.CRITICAL_24H,
            "WARNING_72H" or "72H" or "WARNING" => ExpiryAlertStatus.WARNING_72H,
            "EXPIRED" => ExpiryAlertStatus.EXPIRED,
            _ => Enum.TryParse<ExpiryAlertStatus>(clean, out var res) ? res : null
        };
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
