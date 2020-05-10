import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "light", // ベースのテーマ lightかdarkか
    primary: {
      main: "#00479c",
    },
  },
});

export default theme;
