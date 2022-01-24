import withStyles from "@mui/styles/withStyles";
import Button from "@mui/material/Button";

const NoWrapButton = withStyles({
  root: {
    minWidth: "unset",
  },
  label: {
    whiteSpace: "nowrap",
  },
})(Button);

export default NoWrapButton;
