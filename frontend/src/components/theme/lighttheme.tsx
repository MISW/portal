import { createTheme, adaptV4Theme } from '@mui/material/styles';

const theme = createTheme(
  adaptV4Theme({
    palette: {
      mode: 'light', // ベースのテーマ lightかdarkか
      primary: {
        main: '#c1e4e9',
      },
    },
  }),
);

export default theme;
