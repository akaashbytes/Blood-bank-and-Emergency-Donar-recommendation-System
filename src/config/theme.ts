export const BRAND_TOKENS = {
  name: 'LifeLink Blood Platform',
  tagline: 'Institutional Blood Donation & Management Platform',
  colors: {
    primary: '#8B0015',
    primaryHover: '#B91C2A',
    primaryDark: '#65000F',
    primaryLight: '#FFDAD7',
    secondary: '#B51828',
    secondaryContainer: '#D9353D',
    bgCanvas: '#FCF9F8',
    surface: '#FFFFFF',
    surfaceLow: '#F6F3F2',
    surfaceContainer: '#F0EDED',
    surfaceHigh: '#EAE7E7',
    textMain: '#1B1C1C',
    textMuted: '#5A413F',
    border: '#E2BEBC',
    outline: '#8E706E',
    success: '#15803D',
    successBg: '#DCFCE7',
    warning: '#D97706',
    warningBg: '#FEF3C7',
    danger: '#B91C2A',
    dangerBg: '#FEE2E2',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  rounded: {
    btn: 'rounded-md',
    card: 'rounded-xl',
    chip: 'rounded-full',
    input: 'rounded-md',
  }
};

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export const COMPONENTS_LIST = [
  'Whole Blood',
  'PRBC (Red Cells)',
  'Platelets',
  'FFP (Plasma)',
  'Cryoprecipitate'
] as const;
