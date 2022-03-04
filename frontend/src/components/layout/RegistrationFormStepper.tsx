import React, { ReactNode, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Stepper, Step, StepLabel } from '@mui/material';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

const PREFIX = 'RegisterFormStepper';

const classes = {
  paper: `${PREFIX}-paper`,
  stepper: `${PREFIX}-stepper`,
  buttons: `${PREFIX}-buttons`,
  button: `${PREFIX}-button`,
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  [`&.${classes.paper}`]: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(2),
    },
  },

  [`& .${classes.stepper}`]: {
    padding: theme.spacing(3, 0, 5),
  },

  [`& .${classes.buttons}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  [`& .${classes.button}`]: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export {};

const RegisterFormStepper: React.FC<{
  formName: string;
  children: ReactNode;
  activeStep: number;
  success: boolean;
  steps: string[];
  handleNext: () => void;
  handleBack: () => void;
  nextDisabled?: boolean;
}> = (props) => {
  const router = useRouter();
  const handleHome = useCallback(() => {
    router.push('/');
  }, [router]);
  return (
    <StyledPaper className={classes.paper}>
      <Typography component="h1" variant="h4" align="center">
        {props.formName}
      </Typography>
      <Stepper activeStep={props.activeStep} className={classes.stepper}>
        {props.steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {props.children}
      <div className={classes.buttons}>
        {props.activeStep !== 0 && !props.success && (
          <Button variant="contained" onClick={props.handleBack} className={classes.button}>
            Back
          </Button>
        )}
        {props.activeStep !== props.steps.length - 1 && (
          <Button variant="contained" className={classes.button} color="primary" onClick={props.handleNext} disabled={props.nextDisabled ?? false}>
            Next
          </Button>
        )}
        {props.success && (
          <Button variant="contained" onClick={handleHome} className={classes.button}>
            Back to Home
          </Button>
        )}
      </div>
    </StyledPaper>
  );
};

export default RegisterFormStepper;
