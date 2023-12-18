import React from "react";
import type { Preview } from "@storybook/react";
import { ThemeProvider, CssBaseline } from '@mui/material';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "../application/providers";
import { ConnectKitProvider } from "connectkit";
import { connectKitTheme } from "../application/providers";


/* TODO: update import for your custom Material UI themes */
import Providers, { theme } from '../application/providers';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const decorators = [
  (Story) => (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider customTheme={connectKitTheme}>
        <Story />
      </ConnectKitProvider>
    </WagmiConfig>
  ),
  withThemeFromJSXProvider({
    themes: {
      dark: theme,
    },
    defaultTheme: 'dark',
    Provider: ThemeProvider,
    GlobalStyles: CssBaseline,
  })
];

export default preview;
