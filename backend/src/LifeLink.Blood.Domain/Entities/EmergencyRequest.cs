using LifeLink.Blood.Domain.Common;
using LifeLink.Blood.Domain.Enums;
using NetTopologySuite.Geometries;

namespace LifeLink.Blood.Domain.Entities;

public class EmergencyRequest : BaseEntity
{
    public string RequestCode { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public string HospitalName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public BloodGroup BloodGroup { get; set; }
    public ComponentType Component { get; set; }
    public int UnitsRequired { get; set; }
    public int UnitsAllocated { get; set; }
    public RequestUrgency Urgency { get; set; }
    public RequestStatus Status { get; set; } = RequestStatus.PENDING_VERIFICATION;
    public Guid? RequesterId { get; set; }
    public User? Requester { get; set; }
    public string RequesterName { get; set; } = string.Empty;
    public string RequesterContact { get; set; } = string.Empty;
    public string RequiredBy { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public Point? HospitalLocation { get; set; }

    public ICollection<DonorPledge> Pledges { get; set; } = new List<DonorPledge>();
}
