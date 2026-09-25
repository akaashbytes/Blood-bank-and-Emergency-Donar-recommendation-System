using LifeLink.Blood.Domain.Enums;

namespace LifeLink.Blood.Domain.Helpers;

public static class BloodGroupCompatibility
{
    public static IEnumerable<BloodGroup> GetCompatibleDonorGroups(BloodGroup recipientGroup)
    {
        return recipientGroup switch
        {
            BloodGroup.O_NEG => new[] { BloodGroup.O_NEG },
            BloodGroup.O_POS => new[] { BloodGroup.O_POS, BloodGroup.O_NEG },
            BloodGroup.A_NEG => new[] { BloodGroup.A_NEG, BloodGroup.O_NEG },
            BloodGroup.A_POS => new[] { BloodGroup.A_POS, BloodGroup.A_NEG, BloodGroup.O_POS, BloodGroup.O_NEG },
            BloodGroup.B_NEG => new[] { BloodGroup.B_NEG, BloodGroup.O_NEG },
            BloodGroup.B_POS => new[] { BloodGroup.B_POS, BloodGroup.B_NEG, BloodGroup.O_POS, BloodGroup.O_NEG },
            BloodGroup.AB_NEG => new[] { BloodGroup.AB_NEG, BloodGroup.A_NEG, BloodGroup.B_NEG, BloodGroup.O_NEG },
            BloodGroup.AB_POS => Enum.GetValues<BloodGroup>(),
            _ => new[] { recipientGroup }
        };
    }

    public static bool IsCompatible(BloodGroup donorGroup, BloodGroup recipientGroup)
    {
        return GetCompatibleDonorGroups(recipientGroup).Contains(donorGroup);
    }
}
