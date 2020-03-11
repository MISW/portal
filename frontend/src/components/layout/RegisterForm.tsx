import React, { useState } from 'react';
import RegisterFormStepper from './RegistrationFormStepper';
import UniversityInfo from './UniversityInfo';
import CircleInfo from './CircleInfo';
import FundametalInfo from './FundamentalInfo';
import { UserForSignUp } from '../../user';
import Confirm from './Confirm';

const steps = ['基本情報', '学籍情報', 'サークル内情報', '確認'];

const getStepContent = (step: number, gen1stYear: number,  user: UserForSignUp, onChange: (user: UserForSignUp) => void): JSX.Element => {
  switch (step) {
    case 0:
      return <FundametalInfo user={user} onChange={onChange}/>;
    case 1:
      return <UniversityInfo user={user} onChange={onChange}/>;
    case 2:
      return <CircleInfo user={user} onChange={onChange} gen1stYear={gen1stYear}/>;
    case 3:
      return <Confirm user={user} />;
    default:
      throw new Error('Unknown Step');
  }
};



const RegisterForm: React.FC<{formName: string}> = (props) => {

  const now = new Date();
  const businessYear= now.getFullYear() - (now.getMonth() >= 4 ? 0 : 1);
  const gen1stYear = businessYear - 1969 + 4;

  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState<UserForSignUp>({
    email: '',
    generation: gen1stYear,
    name: '',
    kana: '',
    handle: '',
    sex: 'women',
    university: {
      name: '早稲田大学',
      department: '',
      subject: ''
    },
    student_id: '',
    emergency_phone_number: '',
    other_circles: '',
    workshops: [],
    squads: []
  });

  return (
    <RegisterFormStepper
      formName={props.formName}
      steps={steps}
      handleNext={() => setActiveStep(activeStep + 1)}
      handleBack={() => setActiveStep(activeStep - 1)}
      activeStep={activeStep}
    >
      {getStepContent(activeStep, gen1stYear, user, (u) => {setUser(u); console.log(u);})}
    </RegisterFormStepper>
  );
};

export default RegisterForm;