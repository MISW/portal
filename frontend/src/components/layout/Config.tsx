import React from "react";
import { Box } from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
  })
);

interface ConfigProps {
  title: string;
  node: React.ReactNode;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export const Config: React.FC<{
  configs: ConfigProps[];
}> = ({ configs }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {configs.map((config) => (
        <Box mb={3} key={config.title}>
          <ExpansionPanel key={config.title} expanded={config.expanded}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              onClick={() => config.setExpanded(!config.expanded)}
            >
              <Typography className={classes.heading}>
                {config.title}
              </Typography>
            </ExpansionPanelSummary>
            {config.node}
          </ExpansionPanel>
        </Box>
      ))}
    </div>
  );
};
