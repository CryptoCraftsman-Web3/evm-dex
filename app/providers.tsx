'use client';

import ConnectKitAuth from '@/components/connectkit-auth';
import { xrplDevnet } from '@/lib/xrpl-chains';
import { buttonThemeOptions } from '@/theme/button-theme-options';
import { typographyThemeOptions } from '@/theme/typography-theme-options';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { Montserrat } from 'next/font/google';
import { lighten } from 'polished';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createConfig, sepolia, WagmiConfig } from 'wagmi';

const montserrat = Montserrat({ subsets: ['latin'] });

export const wagmiConfig = createConfig(
  getDefaultConfig({
    infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PID,
    appName: 'SerpentSwap DEX',
    autoConnect: true,
    chains: [xrplDevnet, sepolia],
  })
);

type ProvidersProps = {
  children: React.ReactNode;
};

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    green: true;
    lightGreen: true;
    pink: true;
  }
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    title: React.CSSProperties;
    subtitle3: React.CSSProperties;
    numbers: React.CSSProperties;
    footnote: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    title?: React.CSSProperties;
    subtitle3?: React.CSSProperties;
    numbers?: React.CSSProperties;
    footnote?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    title: true;
    subtitle3: true;
    numbers: true;
    footnote: true;
  }
}

const colors = {
  cta: '#6B0099',
  white: '#FFFFFF',
  black: '#080708',
  secBG: '#181718',
  tertiaryBG: '#252425',
  green: '#075400',
  lightGreen: '#C2E95A',
  pink: '#DB8BFE',
  secText: '#595959',
  tertiaryText: '#353135',
  stroke: '#595959',
  darkStroke: '#353135',
  hoverPurple: '#A000E5',
  clickedPurple: '#56007A',
};

const textGrey = '#ADADAD';
const background = '#080708';
const primary = '#6B0099';
const primaryLight = lighten(0.3, primary);

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.cta,
      light: primaryLight,
    },
    background: {
      default: colors.black,
    },
    text: {
      primary: colors.white
    }
  },
  typography: typographyThemeOptions,
  components: {
    MuiButton: buttonThemeOptions,
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: primaryLight,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          //remove any borders from the default
          border: 'none',
          '&:hover': {
            border: 'none',
          },
          '&::before': {
            border: 'none !important',
          },
          '&::after': {
            border: 'none',
          },
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&:hover': {}
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // notchedOutline: {
        //   borderColor: primaryLight,
        // },
        root: {
          // [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
          //   borderColor: primaryLight,
          // },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: primaryLight,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.secBG,
          color: colors.white,
          borderRadius: '20px',
          padding: '28px',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '20px',
          backgroundImage: 'none',
          '@media (max-width: 600px)': {
            padding: '16px'
          }
        }
      },
      variants: [
        {
          props: { variant: 'green' },
          style: {
            backgroundColor: colors.green,
            borderRadius: '40px',
          }
        },
        {
          props: { variant: 'lightGreen' },
          style: {
            backgroundColor: colors.lightGreen,
            color: colors.black,
            borderRadius: '40px',
          }
        },
        {
          props: { variant: 'pink' },
          style: {
            backgroundColor: colors.pink,
            color: colors.black,
            borderRadius: '40px',
          }
        },
      ]
    }
  },
  shape: {
    borderRadius: 60,
  },
});

const ckBorderRadius = `${theme.shape.borderRadius}px`;

// This style is causing issues with the storybook rendering of components
//  '--ck-font-family': montserrat.style.fontFamily,

export const connectKitTheme = {
  '--ck-overlay-backdrop-filter': 'blur',
  '--ck-border-radius': ckBorderRadius,
  '--ck-connectbutton-border-radius': ckBorderRadius,
  '--ck-connectbutton-color': theme.palette.text.primary,
  '--ck-connectbutton-background': theme.palette.primary.dark,
  '--ck-connectbutton-hover-background': theme.palette.primary.main,
  '--ck-connectbutton-active-background': theme.palette.primary.dark,
  '--ck-body-background': theme.palette.background.default,
  '--ck-primary-button-color': theme.palette.primary.contrastText,
  '--ck-primary-button-background': theme.palette.primary.dark,
  '--ck-primary-button-hover-background': theme.palette.primary.main,
  '--ck-primary-button-active-background': theme.palette.primary.dark,
  '--ck-primary-button-border-radius': ckBorderRadius,
  '--ck-primary-button-hover-border-radius': ckBorderRadius,
  '--ck-primary-button-active-border-radius': ckBorderRadius,
  '--ck-secondary-button-background': theme.palette.primary.dark,
  '--ck-secondary-button-hover-background': theme.palette.primary.main,
  '--ck-secondary-button-active-background': theme.palette.primary.dark,
  '--ck-secondary-button-border-radius': ckBorderRadius,
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider customTheme={connectKitTheme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
          <ToastContainer
            theme="dark"
            position="bottom-center"
            autoClose={2500}
            closeButton={false}
          />
        </ThemeProvider>
        <ConnectKitAuth />
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Providers;
