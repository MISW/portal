import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FundamentalInfo from './forms/FundamentalInfo';
import UniversityInfo from './forms/UniversityInfo';
import CircleInfo from './forms/CircleInfo';
import { UserDataForSignUp } from '../../user';

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

const steps = ['基本情報', '学籍情報', 'サークル内情報', '確認'] as const;

const getStepContent = (step: number): JSX.Element => {
  switch (step) {
    case 0:
      return <FundamentalInfo />;
    case 1:
      return <UniversityInfo />;
    case 2:
      return <CircleInfo />;
    case 3:
      return <></>;
    default:
      throw new Error('Unknown Step');
  }
};

export type RegisterFormProps = { formName: string };

const RegisterForm: React.FC<RegisterFormProps> = (props: RegisterFormProps) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData]  = useState<Partial<UserDataForSignUp>>({});

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h4" align="center">
        {props.formName}
      </Typography>
      <Stepper activeStep={activeStep} className={classes.stepper}>
        {
          steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))
        }
      </Stepper>
      {getStepContent(activeStep)}
      <div className={classes.buttons}>
        {activeStep !== 0 && (
          <Button
            variant="contained"
            onClick={handleBack}
            className={classes.button}
          >
            Back
          </Button>
        )}
        {activeStep !== steps.length - 1 && (
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </div>
    </Paper>
  );
};

export default RegisterForm;