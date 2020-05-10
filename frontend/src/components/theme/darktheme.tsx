import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark", // ベースのテーマ lightかdarkか
    primary: {
      main: "#444444", //"#00479c",
    },
  },
});

export default theme;
