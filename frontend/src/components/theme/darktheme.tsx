import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark", // ベースのテーマ lightかdarkか
    primary: {
      main: "#00479c",
    },
  },
});

export default theme;
