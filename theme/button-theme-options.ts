import { colors } from "./default-colors"
import type { Components } from '@mui/material/styles';

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    primary: true;
    widget: true;
    link: true;
  }
}

export const buttonThemeOptions: Components['MuiButton'] = {
  defaultProps: {
    disableElevation: true,
    disableRipple: true,
    disableFocusRipple: true,
    style: {
      transition: 'all 0.1s ease-out',
      minWidth: '0px'
    }
  },
  styleOverrides: {
    root: {
      textTransform: 'none',
      minWidth: '0px',
      gap: '12px',
      backgroundColor: colors.cta,
      '&:hover': {
        backgroundColor: colors.hoverPurple,
        color: colors.white,
      },
      '&:active': {
        backgroundColor: colors.clickedPurple,
      },
      '&:disabled': {
        backgroundColor: colors.tertiaryBG,
        color: colors.secText,
      },
    },
    endIcon: {
      margin: 0
    },
    startIcon: {
      margin: 0
    },
  },
  variants: [
    {
      // Contained Primary style
      props: { variant: 'contained' },
      style: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: '1.5rem',
        padding: '16px 28px',

      }
    },
    {
      // Contained Small style
      props: { variant: 'contained', size: 'small' },
      style: {
        display: 'inline-flex',
        padding: '10px 20px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '4px',
        fontSize: '1rem',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '1.5rem',
      }
    },
    {
      // Widget Primary style
      props: { variant: 'widget' },
      style: {
        borderRadius: '12px',
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: '1.5rem',
        padding: '16px 28px',
      }
    },
    {
      // Widget Small style
      props: { variant: 'widget', size: 'small' },
      style: {
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: '1.5rem',
        padding: '10px 28px',
        gap: '4px',
        maxHeight: '44px'
      }
    },
    {
      // Widget Primary style
      props: { variant: 'link' },
      style: {
        borderRadius: '0',
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: '1.5rem',
        padding: '0',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
          textDecoration: 'underline',
        },
        '&:active': {
          backgroundColor: 'transparent',
        },
        '&:disabled': {
          backgroundColor: 'transparent',
          color: colors.secText,
        },
      }
    },
  ]
}