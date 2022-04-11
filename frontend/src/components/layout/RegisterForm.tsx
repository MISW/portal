import { useState, useCallback, ReactNode, useMemo } from 'react';
import * as React from 'react';
import RegisterFormStepper from './RegistrationFormStepper';
import UniversityInfo from './UniversityInfo';
import CircleInfo from './CircleInfo';
import FundamentalInfo from './FundamentalInfo';
import { ConfigurableProfile } from '../../user';
import Confirm from './Confirm';
import { useUser, UserProfileHooks } from '../../hooks/formHooks';
import { Container } from '@mui/material';

const steps = ['基本情報', '学籍情報', 'サークル内情報', '確認'];

const validateFormContents = (obj: Partial<UserProfileHooks>): boolean => {
  const valid = Object.values(obj).every((v) => (v ? v.check() : true));
  return valid;
};

export type SubmitResult =
  | {
      status: 'success';
    }
  | {
      status: 'error';
      message: string;
    }
  | null;

const RegisterForm: React.FC<
  React.PropsWithChildren<{
    formName: string;
    user?: Partial<ConfigurableProfile>;
    onSubmit: (user: ConfigurableProfile) => Promise<SubmitResult>;
    successMessage: ReactNode;
    formType: 'setting' | 'new';
  }>
> = ({ formName, user, onSubmit, successMessage, formType }) => {
  const now = new Date();
  const businessYear = now.getFullYear() - (now.getMonth() + 1 >= 4 ? 0 : 1);
  const genFirstYear = businessYear - 1969 + 4;

  const { user: userData, valid, userHooks } = useUser(genFirstYear, user);
  const [activeStep, setActiveStep] = useState(0);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);

  const {
    email,
    generation,
    name,
    kana,
    handle,
    sex,
    univName,
    department,
    subject,
    studentId,
    emergencyPhoneNumber,
    otherCircles,
    workshops,
    squads,
    discordId,
  } = userHooks;

  const contentHooks = useMemo(() => {
    const fundamentalInfo = {
      name,
      kana,
      email,
      sex,
      emergencyPhoneNumber,
    };
    const universityInfo = {
      univName,
      department,
      subject,
      studentId,
    };
    const circleInfo = {
      generation,
      handle,
      otherCircles,
      workshops,
      squads,
      discordId,
    };
    return [fundamentalInfo, universityInfo, circleInfo] as const;
  }, [name, kana, email, sex, emergencyPhoneNumber, univName, department, subject, studentId, generation, handle, otherCircles, workshops, squads, discordId]);

  const [submitResult, setSubmitResult] = useState<SubmitResult>(null);

  const handleSubmit = useCallback(async () => {
    const res = await onSubmit(userData);
    setSubmitResult(res);
  }, [userData, onSubmit]);

  const handleNext = useCallback(() => {
    const hook = contentHooks[activeStep];
    const valid = validateFormContents(hook);
    if (!valid) {
      setNextButtonDisabled(true);
      return;
    }
    setActiveStep(activeStep + 1);
  }, [activeStep, contentHooks]);

  const handleBack = useCallback(() => setActiveStep(activeStep - 1), [activeStep]);

  if (nextButtonDisabled) {
    const hook = contentHooks[activeStep];
    const valid = Object.values(hook as Partial<UserProfileHooks>).every((v) => (v ? v.valid : true));
    if (valid) setNextButtonDisabled(false);
  }

  return (
    <Container maxWidth="sm">
      <RegisterFormStepper
        formName={formName}
        steps={steps}
        handleNext={handleNext}
        handleBack={handleBack}
        activeStep={activeStep}
        nextDisabled={nextButtonDisabled}
        success={submitResult?.status === 'success'}
      >
        {((step: number) => {
          switch (step) {
            case 0:
              return <FundamentalInfo userHooks={userHooks} />;
            case 1:
              return <UniversityInfo userHooks={userHooks} />;
            case 2:
              return <CircleInfo userHooks={userHooks} genFirstYear={genFirstYear} formType={formType} />;
            case 3:
              return <Confirm user={userData} valid={valid} onSubmit={handleSubmit} successMessage={successMessage} submitResult={submitResult} />;
            default:
              throw new Error('Unknown Step');
          }
        })(activeStep)}
      </RegisterFormStepper>
    </Container>
  );
};

export default RegisterForm;
