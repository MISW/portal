import { ReactNode } from 'react';
import * as React from 'react';
import { Box, Button, FormHelperText } from '@mui/material';
import { ConfigurableProfile, toUserInfoJSON } from '../../user';
import { UserValidation } from '../../hooks/formHooks';
import Profile from './Profile';
import { SubmitResult } from './RegisterForm';
import { Alert } from '@mui/material';
import { toCamelCase } from 'infra/converter';
import { User } from 'models/user';

const Confirm: React.FC<
  React.PropsWithChildren<{
    user: ConfigurableProfile;
    valid: UserValidation;
    submitResult: SubmitResult;
    successMessage: ReactNode;
    onSubmit: () => Promise<void>;
  }>
> = ({ user, valid, onSubmit, successMessage, submitResult: submitResult }) => {
  const filledCorrectly = Object.values(valid).reduce((prev, cur) => prev && cur, true);
  return (
    <>
      <Profile user={toCamelCase(toUserInfoJSON(user)) as User} title={false} size="small"></Profile>

      <Box mt={4}>
        {(!submitResult || submitResult.status !== 'success') && (
          <Button
            className="button"
            variant="contained"
            color="primary"
            onClick={async (e) => {
              e.preventDefault();
              onSubmit();
            }}
            disabled={!filledCorrectly}
          >
            提出
          </Button>
        )}
        {!filledCorrectly && <FormHelperText error>フォームが正しく記入されていません</FormHelperText>}
        {submitResult?.status === 'success' && successMessage}
        {submitResult?.status === 'error' && <Alert severity="error">{submitResult.message}</Alert>}
      </Box>
    </>
  );
};

export default Confirm;
