import React from 'react';
import { UserForSignUp } from '../../user';
import { Button } from '@material-ui/core';
import { signUp } from '../../network';

const Confirm: React.FC<{
  user: Partial<UserForSignUp>
}> = ({ user }) => {
  const filled = Object.values(user).every(b => b !== undefined);
  if (filled) {
    return (
      <Button
        className="button"
        variant="contained"
        color="primary"
        onClick={() => signUp(user as UserForSignUp).then(() => console.log('signUp!')).catch(err => console.error(err))}
      >
        提出
      </Button>
    );
  }
  return <></>;
};

export default Confirm;