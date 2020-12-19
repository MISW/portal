import { withStyles } from "../src_furui/@material-ui/core/styles";
import Button from "../src_furui/@material-ui/core/Button";

const NoWrapButton = withStyles({
  root: {
    minWidth: "unset",
  },
  label: {
    whiteSpace: "nowrap",
  },
})(Button);

export default NoWrapButton;
