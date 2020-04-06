import React, { useState } from "react";
import RegisterFormStepper from "./RegistrationFormStepper";
import UniversityInfo from "./UniversityInfo";
import CircleInfo from "./CircleInfo";
import FundamentalInfo from "./FundamentalInfo";
import { UserProfile } from "../../user";
import Confirm from "./Confirm";
import {
  useUserWithValidation,
  UserValidation,
  SetUserProfileFuncs,
} from "../../hooks/formHooks";

const steps = ["基本情報", "学籍情報", "サークル内情報", "確認"];

const StepContent: React.FC<{
  step: number;
  gen1stYear: number;
  user: UserProfile;
  valid: UserValidation;
  setFuncs: SetUserProfileFuncs;
  onSubmit: () => void;
}> = ({ step, gen1stYear, user, valid, setFuncs, onSubmit }) => {
  switch (step) {
    case 0:
      return <FundamentalInfo user={user} valid={valid} setFuncs={setFuncs} />;
    case 1:
      return <UniversityInfo user={user} valid={valid} setFuncs={setFuncs} />;
    case 2:
      return (
        <CircleInfo
          user={user}
          valid={valid}
          setFuncs={setFuncs}
          gen1stYear={gen1stYear}
        />
      );
    case 3:
      return <Confirm user={user} valid={valid} onSubmit={onSubmit} />;
    default:
      throw new Error("Unknown Step");
  }
};

const RegisterForm: React.FC<{
  formName: string;
  user?: Partial<UserProfile>;
  onSubmit: (user: UserProfile) => void;
}> = (props) => {
  const [activeStep, setActiveStep] = useState(0);

  const now = new Date();
  const businessYear = now.getFullYear() - (now.getMonth() + 1 >= 4 ? 0 : 1);
  const gen1stYear = businessYear - 1969 + 4;
  const { user, setFuncs, valid } = useUserWithValidation(
    gen1stYear,
    props.user
  );
  console.log(valid);

  return (
    <RegisterFormStepper
      formName={props.formName}
      steps={steps}
      handleNext={() => setActiveStep(activeStep + 1)}
      handleBack={() => setActiveStep(activeStep - 1)}
      activeStep={activeStep}
    >
      <StepContent
        step={activeStep}
        gen1stYear={gen1stYear}
        user={user}
        valid={valid}
        setFuncs={setFuncs}
        onSubmit={() => props.onSubmit(user)}
      />
    </RegisterFormStepper>
  );
};

export default RegisterForm;
