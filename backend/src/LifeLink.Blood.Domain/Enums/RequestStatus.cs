namespace LifeLink.Blood.Domain.Enums;

public enum RequestStatus
{
    PENDING_VERIFICATION,
    IN_PROGRESS,
    MATCH_FOUND,
    DISPATCHED,
    FULFILLED,
    REJECTED,
    CANCELLED
}
