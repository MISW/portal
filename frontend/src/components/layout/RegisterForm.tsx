import React, { useState } from 'react';
import RegisterFormStepper from './RegistrationFormStepper';
import UniversityInfo from './UniversityInfo';
import CircleInfo from './CircleInfo';
import FundametalInfo from './FundamentalInfo';
import { UserForSignUp } from '../../user';
import Confirm from './Confirm';

const steps = ['基本情報', '学籍情報', 'サークル内情報', '確認'];

const getStepContent = (step: number, user: Partial<UserForSignUp>, onChange: (user: Partial<UserForSignUp>) => void): JSX.Element => {
  switch (step) {
    case 0:
      return <FundametalInfo user={user} onChange={onChange}/>;
    case 1:
      return <UniversityInfo user={user} onChange={onChange}/>;
    case 2:
      return <CircleInfo user={user} onChange={onChange} />;
    case 3:
      return <Confirm user={user} />;
    default:
      throw new Error('Unknown Step');
  }
};

const RegisterForm: React.FC<{formName: string}> = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState<Partial<UserForSignUp>>({});

  return (
    <RegisterFormStepper
      formName={props.formName}
      steps={steps}
      handleNext={() => setActiveStep(activeStep + 1)}
      handleBack={() => setActiveStep(activeStep - 1)}
      activeStep={activeStep}
    >
      {getStepContent(activeStep, user, (u) => {setUser(u); console.log(u);})}
    </RegisterFormStepper>
  );
};

export default RegisterForm;