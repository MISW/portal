import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PREFIX = 'Config';

const classes = {
  root: `${PREFIX}-root`,
  heading: `${PREFIX}-heading`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    width: '100%',
  },

  [`& .${classes.heading}`]: {
    fontSize: theme.typography.pxToRem(15),
  },
}));

interface ConfigProps {
  title: string;
  node: React.ReactNode;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export const Config: React.FC<
  React.PropsWithChildren<{
    configs: ConfigProps[];
  }>
> = ({ configs }) => {
  return (
    <Root className={classes.root}>
      {configs.map((config) => (
        <Box mb={3} key={config.title}>
          <Accordion key={config.title} expanded={config.expanded}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              onClick={() => config.setExpanded(!config.expanded)}
            >
              <Typography className={classes.heading}>{config.title}</Typography>
            </AccordionSummary>
            {config.node}
          </Accordion>
        </Box>
      ))}
    </Root>
  );
};
