import React, { useState } from "react";
import RegisterFormStepper from "./RegistrationFormStepper";
import UniversityInfo from "./UniversityInfo";
import CircleInfo from "./CircleInfo";
import FundamentalInfo from "./FundamentalInfo";
import { UserProfile } from "../../user";
import Confirm from "./Confirm";
import { useUser, UserProfileHooks, UserValidation } from "../../hooks/formHooks";

const steps = ["基本情報", "学籍情報", "サークル内情報", "確認"];

const StepContent: React.FC<{
  step: number;
  genFirstYear: number;
  user: UserProfile;
  valid: UserValidation;
  userHooks: UserProfileHooks;
  onSubmit: () => void;
}> = ({ step, genFirstYear, user, onSubmit, valid, userHooks }) => {
  switch (step) {
    case 0:
      return <FundamentalInfo userHooks={userHooks} />;
    case 1:
      return <UniversityInfo userHooks={userHooks} />;
    case 2:
      return <CircleInfo userHooks={userHooks} genFirstYear={genFirstYear} />;
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
  const genFirstYear = businessYear - 1969 + 4;
  const { user, valid, userHooks } = useUser(genFirstYear, props.user);

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
        genFirstYear={genFirstYear}
        user={user}
        valid={valid}
        userHooks={userHooks}
        onSubmit={() => props.onSubmit(user)}
      />
    </RegisterFormStepper>
  );
};

export default RegisterForm;
