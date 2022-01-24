import { createTheme, adaptV4Theme } from "@mui/material/styles";

const theme = createTheme(
  adaptV4Theme({
    palette: {
      mode: "dark", // ベースのテーマ lightかdarkか
      primary: {
        main: "#808080", //"#00479c",
      },
    },
  })
);

export default theme;
