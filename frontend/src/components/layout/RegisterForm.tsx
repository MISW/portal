import React, { useState } from "react";
import RegisterFormStepper from "./RegistrationFormStepper";
import UniversityInfo from "./UniversityInfo";
import CircleInfo from "./CircleInfo";
import FundamentalInfo from "./FundamentalInfo";
import { UserForSignUp } from "../../user";
import Confirm from "./Confirm";
import { signUp } from "../../network";

const steps = ["基本情報", "学籍情報", "サークル内情報", "確認"];

const StepContent: React.FC<{
  step: number;
  gen1stYear: number;
  user: UserForSignUp;
  onChange: (user: UserForSignUp) => void;
  onSubmit: () => void;
}> = (props) => {
  switch (props.step) {
    case 0:
      return <FundamentalInfo user={props.user} onChange={props.onChange} />;
    case 1:
      return <UniversityInfo user={props.user} onChange={props.onChange} />;
    case 2:
      return <CircleInfo user={props.user} onChange={props.onChange} gen1stYear={props.gen1stYear} />;
    case 3:
      return <Confirm onSubmit={props.onSubmit} />;
    default:
      throw new Error("Unknown Step");
  }
};

const RegisterForm: React.FC<{ formName: string; user?: UserForSignUp; onSubmit: (user: UserForSignUp) => void }> = (
  props
) => {
  const now = new Date();
  const businessYear = now.getFullYear() - (now.getMonth() >= 4 ? 0 : 1);
  const gen1stYear = businessYear - 1969 + 4;

  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState<UserForSignUp>(
    props.user
      ? props.user
      : {
          email: "",
          generation: gen1stYear,
          name: "",
          kana: "",
          handle: "",
          sex: "women",
          university: {
            name: "早稲田大学",
            department: "",
            subject: "",
          },
          // eslint-disable-next-line @typescript-eslint/camelcase
          student_id: "",
          // eslint-disable-next-line @typescript-eslint/camelcase
          emergency_phone_number: "",
          // eslint-disable-next-line @typescript-eslint/camelcase
          other_circles: "",
          workshops: [],
          squads: [],
        }
  );

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
        onChange={(u) => {
          setUser(u);
          console.log(u);
        }}
        onSubmit={() => props.onSubmit(user)}
      />
    </RegisterFormStepper>
  );
};

export default RegisterForm;
