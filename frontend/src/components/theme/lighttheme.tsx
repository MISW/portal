import { createTheme, adaptV4Theme } from '@mui/material/styles';

const theme = createTheme(
  adaptV4Theme({
    palette: {
      mode: 'light', // ベースのテーマ lightかdarkか
      primary: {
        main: '#00479c',
      },
    },
  }),
);

export default theme;
