import { colors } from "./default-colors"
import type { Components } from '@mui/material/styles';

export const alertThemeOptions: Components['MuiAlert'] = {
  styleOverrides: {
    root: {
      flexDirection: 'row',
      alignItems: 'center',
    }
  }
}