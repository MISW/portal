import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: '#5072d0',
      main: '#00479e',
      dark: '#00216f',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#d38335',
      main: '#9d5600',
      dark: '#6a2c00',
      contrastText: '#ffffff',
    },
  },
});

export default theme;
