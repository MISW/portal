import React, { useState } from "react";
import RegisterFormStepper from "./RegistrationFormStepper";
import UniversityInfo from "./UniversityInfo";
import CircleInfo from "./CircleInfo";
import FundamentalInfo from "./FundamentalInfo";
import { UserProfile } from "../../user";
import Confirm from "./Confirm";

const steps = ["基本情報", "学籍情報", "サークル内情報", "確認"];

const StepContent: React.FC<{
  step: number;
  gen1stYear: number;
  user: UserProfile;
  onChange: (user: UserProfile) => void;
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

const RegisterForm: React.FC<{ formName: string; user?: UserProfile; onSubmit: (user: UserProfile) => void }> = (
  props
) => {
  const now = new Date();
  const businessYear = now.getFullYear() - (now.getMonth() + 1 >= 4 ? 0 : 1);
  const gen1stYear = businessYear - 1969 + 4;

  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState<UserProfile>(
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
          student_id: "",
          emergency_phone_number: "",
          other_circles: "",
          workshops: [],
          squads: [],
        }
  );

  type UserValidation = { [P in keyof Omit<UserProfile, "university">]: boolean } & {
    university: { [P in keyof UserProfile["university"]]: boolean };
  };

  const valid: UserValidation = {
    email: /^+@+$/.test(user.email),
    generation: true,
    name: /^\S+\s\S+$/.test(user.name),
    kana: /^\S+\s\S+$/.test(user.kana),
    handle: /^\S+$/.test(user.handle),
    sex: true,
    university: {
      name: /^\S+$/.test(user.university.name),
      department: /^\S+$/.test(user.university.department),
      subject: true,
    },
    student_id: true,
    emergency_phone_number: /^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/.test(user.emergency_phone_number),
    other_circles: true,
    workshops: user.workshops.length !== 0,
    squads: true,
  };

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
