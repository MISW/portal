import { withStyles } from 'tss-react/mui';
import Button from '@mui/material/Button';

const NoWrapButton = withStyles(Button, {
  root: {
    minWidth: 'unset',
  },
  label: {
    whiteSpace: 'nowrap',
  },
});

export default NoWrapButton;
