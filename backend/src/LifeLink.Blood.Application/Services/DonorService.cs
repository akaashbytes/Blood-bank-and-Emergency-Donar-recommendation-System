using AutoMapper;
using LifeLink.Blood.Application.DTOs.Donor;
using LifeLink.Blood.Application.Interfaces;
using LifeLink.Blood.Domain.Entities;

namespace LifeLink.Blood.Application.Services;

public class DonorService : IDonorService
{
    private readonly IDonorRepository _donorRepository;
    private readonly IMapper _mapper;

    public DonorService(IDonorRepository donorRepository, IMapper mapper)
    {
        _donorRepository = donorRepository;
        _mapper = mapper;
    }

    public async Task<DonorRecordDto?> GetDonorByUserIdAsync(Guid userId)
    {
        var donor = await _donorRepository.GetDonorWithHealthMetricsByUserIdAsync(userId);
        if (donor == null) return null;

        return _mapper.Map<DonorRecordDto>(donor);
    }

    public async Task<IReadOnlyList<DonorListItemDto>> GetAllDonorsAsync()
    {
        var donors = await _donorRepository.GetAllAsync();
        return _mapper.Map<IReadOnlyList<DonorListItemDto>>(donors);
    }
}
