'use client';

import ConnectKitAuth from '@/components/connectkit-auth';
import { xrplDevnet } from '@/lib/xrpl-chains';
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

const wagmiConfig = createConfig(
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

const purple = '#6B0099';
const hoverPurple = '#A000E5';
const clickedPurple = '#56007A';
const disabledPurple = '#252425';
const textGrey = '#ADADAD';

const Providers = ({ children }: ProvidersProps) => {
  const background = '#080708';
  const primary = '#6B0099';
  const primaryLight = lighten(0.3, primary);
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: primary,
        light: primaryLight,
      },
      background: {
        default: background,
      },
      text: {
        primary: '#FFF'
      }
    },
    typography: {
      fontFamily: 'GeneralSans, sans-serif',
      h1: {
        fontFamily: 'Kanit, sans-serif ',
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
        lineHeight: '140%',
      },
      h4: {
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
      body1: {
        color: textGrey,
        fontSize: '1.125rem',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '160%',
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
          disableRipple: true,
          disableFocusRipple: true,
          style: {
            transition: 'none'
          }
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
        variants: [
          {
            props: { variant: 'contained', size: 'large' },
            style: {
              fontSize: '1.125rem',
              fontWeight: 600,
              lineHeight: '1.5rem',
              padding: '1rem 1.75rem',
              backgroundColor: purple,
              '&:hover': {
                backgroundColor: hoverPurple,
              },
              '&:active': {
                backgroundColor: clickedPurple,
              },
              '&:disabled': {
                backgroundColor: disabledPurple,
              },
            }
          },
          {
            props: { variant: 'contained', size: 'small' },
            style: {
              display: 'inline-flex',
              padding: '0.63rem 1.75rem',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: purple,
              fontSize: '1rem',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '1.5rem',
              '&:hover': {
                backgroundColor: hoverPurple,
              },
              '&:active': {
                backgroundColor: clickedPurple,
              },
              '&:disabled': {
                backgroundColor: disabledPurple,
              },
            }
          },
        ]
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& label.Mui-focused': {
              color: primaryLight,
            },
          },
        },
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
            borderRadius: '40px'
          }
        }
      }
    },
    shape: {
      borderRadius: 60,
    },
  });

  const ckBorderRadius = `${theme.shape.borderRadius}px`;

  const connectKitTheme = {
    '--ck-font-family': montserrat.style.fontFamily,
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
            bodyStyle={{
              fontFamily: montserrat.style.fontFamily,
            }}
            closeButton={false}
          />
        </ThemeProvider>
        <ConnectKitAuth />
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Providers;
