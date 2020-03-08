import React, { ReactNode } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(2)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  }
}));

const RegisterFormStepper: React.FC<{
  formName: string;
  children: ReactNode;
  activeStep: number;
  steps: string[];
  handleNext: () => void;
  handleBack: () => void;
}> = (props) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h4" align="center">
        {props.formName}
      </Typography>
      <Stepper activeStep={props.activeStep} className={classes.stepper}>
        {
          props.steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))
        }
      </Stepper>
      {props.children}
      <div className={classes.buttons}>
        {props.activeStep !== 0 && (
          <Button
            variant="contained"
            onClick={props.handleBack}
            className={classes.button}
          >
            Back
          </Button>
        )}
        {props.activeStep !== props.steps.length - 1 && (
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            onClick={props.handleNext}
          >
            Next
          </Button>
        )}
      </div>
    </Paper>
  );
};

export default RegisterFormStepper;