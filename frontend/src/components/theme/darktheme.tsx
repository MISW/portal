import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#99daff',
      main: '#61a9ff',
      dark: '#167acb',
      contrastText: '#000000',
    },
    secondary: {
      light: '#ffea91',
      main: '#ffb861',
      dark: '#c88833',
      contrastText: '#000000',
    },
    background: {
      paper: '#ffb861',
    },
  },
});

export default theme;
