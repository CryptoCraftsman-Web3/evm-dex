import { colors } from "./default-colors"
import { ThemeOptions } from '@mui/material/styles';

declare module "@mui/material/styles" {
  interface TypographyVariants {
    title: React.CSSProperties;
    subtitle3: React.CSSProperties;
    numbers: React.CSSProperties;
    footnote: React.CSSProperties;
    body16Medium: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    title?: React.CSSProperties;
    subtitle3?: React.CSSProperties;
    numbers?: React.CSSProperties;
    footnote?: React.CSSProperties;
    body16Medium?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    title: true;
    subtitle3: true;
    numbers: true;
    footnote: true;
    body16Medium: true;
  }
}

export const typographyThemeOptions: ThemeOptions['typography'] = {
  fontFamily: 'GeneralSans, sans-serif',
  h1: {
    fontFamily: 'Kanit, sans-serif',
    fontWeight: 500,
    fontSize: '8.75rem',
    lineHeight: '90%',
    textTransform: 'uppercase',
    '@media (max-width: 600px)': {
      fontSize: '5rem',
    }
  },
  h2: {
    fontSize: '4.65rem',
    fontWeight: 600,
    lineHeight: '110%',
  },
  h3: {
    fontSize: '3.5625rem',
    fontWeight: 600,
    fontStyle: 'normal',
    lineHeight: '140%',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 600,
    lineHeight: '120%',
  },
  subtitle1: {
    fontSize: '1.625rem',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '150%',
  },
  subtitle2: {
    fontSize: '1.625rem',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '150%',
  },
  subtitle3: {
    fontSize: '1.625rem',
    fontStyle: 'normal',
    fontWeight: 600,
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
    fontSize: '1.125rem',
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
  body16Medium: {
    color: colors.secText,
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '160%',
  },
  footnote: {
    fontSize: '0.8125rem',
    color: '#ADADAD',
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