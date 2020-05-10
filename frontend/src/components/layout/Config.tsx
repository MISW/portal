import React from 'react';
import { Box } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);

interface ConfigProps {
  title: string,
  node: React.ReactNode;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
};

export const Config: React.FC<{
  configs: ConfigProps[];
}> = ({
  configs,
}) => {
    const fn = async () => {
      throw new Error("hello");
    };

    const classes = useStyles();

    return (
      <div className={classes.root}>
        {
          configs.map(
            config => (
              <Box mb={3} key={config.title}>
                <ExpansionPanel key={config.title} expanded={config.expanded}>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    onClick={() => config.setExpanded(!config.expanded)}
                  >
                    <Typography className={classes.heading}>{config.title}</Typography>
                  </ExpansionPanelSummary>
                  {config.node}
                </ExpansionPanel>
              </Box>
            )
          )
        }
      </div>
    );
  };
