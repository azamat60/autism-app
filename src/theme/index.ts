import { DefaultTheme } from '@react-navigation/native';

const colors = {
  background: '#F5F7F4',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF3EF',
  textPrimary: '#2B3A3D',
  textSecondary: '#5A6A6D',
  border: '#D7E1DD',
  primary: '#89B8B2',
  primaryPressed: '#7BA8A2',
  success: '#A7D9B2',
  focus: '#B8D5EF',
  colorBlue: '#A7C7E7',
  colorPeach: '#F6C7B6',
  colorMint: '#BDE7D0',
  colorLilac: '#D7C8F0',
  colorSun: '#F7E2AA',
};

const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

const radius = {
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

const typography = {
  title: 30,
  heading: 24,
  body: 18,
  bodySmall: 15,
  button: 20,
};

const shadows = {
  card: {
    shadowColor: '#334455',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
};

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.primary,
  },
};
