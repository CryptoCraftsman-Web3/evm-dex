import { colors } from "./default-colors"
import { ThemeOptions } from '@mui/material/styles';

declare module "@mui/material/styles" {
  interface TypographyVariants {
    title: React.CSSProperties;
    subtitleSemibold: React.CSSProperties;
    subtitleMedium: React.CSSProperties;
    subtitle: React.CSSProperties;
    numbers: React.CSSProperties;
    body18: React.CSSProperties;
    body18Medium: React.CSSProperties;
    body16: React.CSSProperties;
    body16Medium: React.CSSProperties;
    footnoteMedium: React.CSSProperties;
    footnote: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    title?: React.CSSProperties;
    subtitleSemibold: React.CSSProperties;
    subtitleMedium: React.CSSProperties;
    subtitle?: React.CSSProperties;
    numbers?: React.CSSProperties;
    body18?: React.CSSProperties;
    body18Medium?: React.CSSProperties;
    body16?: React.CSSProperties;
    body16Medium?: React.CSSProperties;
    footnoteMedium?: React.CSSProperties;
    footnote?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    title: true;
    subtitleSemibold: true;
    subtitleMedium: true;
    subtitle: true;
    numbers: true;
    body18: true;
    body18Medium: true;
    body16: true;
    body16Medium: true;
    footnoteMedium: true;
    footnote: true;
  }
}

export const typographyThemeOptions: ThemeOptions['typography'] = {
  fontFamily: 'GeneralSans, sans-serif',
  h1: {
    fontFamily: 'Kanit, sans-serif',
    fontSize: '140px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '90%',
    textTransform: 'uppercase',
    '@media (max-width: 600px)': {
      fontSize: '64px',
    }
  },
  h2: {
    fontSize: '74px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '110%',
  },
  h3: {
    fontSize: '57px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '140%',
  },
  title: {
    fontSize: '48px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '120%',
  },
  subtitleSemibold: {
    fontSize: '26px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '150%',
  },
  subtitleMedium: {
    fontSize: '26px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '150%',
  },
  subtitle: {
    fontSize: '26px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '150%',
  },
  numbers: {
    fontSize: '1.25rem',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '160%',
  },
  body1: {
    color: colors.textGrey,
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '160%',
  },
  body2: {
    color: colors.textGrey,
    fontSize: '1rem',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '160%',
  },
  body18: {
    color: colors.secText,
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '160%',
  },
  body18Medium: {
    color: colors.secText,
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '160%',
  },
  body16: {
    color: colors.secText,
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '160%',
  },
  body16Medium: {
    color: colors.secText,
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '160%',
  },
  footnoteMedium: {
    fontSize: '13px',
    color: colors.secText,
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '130%'
  },
  footnote: {
    fontSize: '13px',
    color: colors.secText,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '130%'
  },
  button: {
    fontSize: '18px',
    fontStyle: 'normal',
    textTransform: 'none',
    fontWeight: 600,
    lineHeight: '24px'
  }
}