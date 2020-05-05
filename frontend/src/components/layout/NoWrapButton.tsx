import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const NoWrapButton = withStyles({
  root: {
    minWidth: "unset",
  },
  label: {
    whiteSpace: "nowrap",
  },
})(Button);

export default NoWrapButton;
