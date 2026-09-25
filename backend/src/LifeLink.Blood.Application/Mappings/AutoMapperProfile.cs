using AutoMapper;
using LifeLink.Blood.Application.DTOs.Auth;
using LifeLink.Blood.Application.DTOs.Donor;
using LifeLink.Blood.Domain.Entities;

namespace LifeLink.Blood.Application.Mappings;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<DonorHealthMetrics, DonorHealthMetricsDto>();
        CreateMap<DonorRecord, DonorRecordDto>();
        CreateMap<DonorRecord, DonorListItemDto>();
    }
}
