import React from "react";
import { Button, FormHelperText } from "@material-ui/core";
import { UserProfile } from "../../user";
import { UserValidation } from "../../hooks/formHooks";

const Confirm: React.FC<{
  user: UserProfile;
  valid: UserValidation;
  onSubmit: () => void;
}> = ({ user, valid, onSubmit }) => {
  const filledCorrectly = Object.values(valid).reduce((prev, cur) => prev && cur, true);
  return (
    <>
      <Button
        className="button"
        variant="contained"
        color="primary"
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        disabled={!filledCorrectly}
      >
        提出
      </Button>
      {!filledCorrectly && <FormHelperText error>フォームが正しく記入されていません</FormHelperText>}
    </>
  );
};

export default Confirm;
