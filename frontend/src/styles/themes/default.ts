import { DefaultTheme as PaperTheme } from 'react-native-paper';

import colors from '../colors';

export const theme = {
  ...PaperTheme,
  colors: {
    ...PaperTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
  },
}
