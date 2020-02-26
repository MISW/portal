import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button'

type FormName = 'join' | 'setting';

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

const steps = ['基本情報', '学籍情報', 'サークル内情報', '確認'] as const

const getStepContent = (step: number): JSX.Element => {
  switch (step) {
    case 0:
      return <>実装予定</>;
    case 1:
      return <></>;
    case 2:
      return <></>;
    case 3:
      return <></>;
    default:
      throw new Error('Unknown Step');
  }
}

const RegisterForm: React.FC<{}> = (props: {}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }
  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }
  return (
  <>
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h4" align="center">
        会員登録
      </Typography>
      <Stepper activeStep={activeStep}className={classes.stepper}>
        {
          steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))
        }
      </Stepper>
      <>
        {activeStep === steps.length? (
          <>
            <Typography variant="h5" >
              QRコードを会計に読み取ってもらってくれよな!
            </Typography>
            <Typography variant="subtitle1">
              ここにQRコードが出ます
            </Typography>
          </>
        ) : (
          <>
            {getStepContent(activeStep)}
            <div className={classes.buttons}>
              {activeStep != 0 && (
                <Button 
                  variant="contained"
                  onClick={handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
              )}
              {activeStep != steps.length - 1 && (
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
          </>
        )}
      </>
    </Paper>
  </>
);
}

export default RegisterForm;