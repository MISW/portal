import React, { ReactNode } from "react";
import { Button, FormHelperText } from "@material-ui/core";
import { ConfigurableProfile } from "../../user";
import { UserValidation } from "../../hooks/formHooks";
import { SubmitResult } from "./RegisterForm";
import { Alert } from "@material-ui/lab";

const Confirm: React.FC<{
  user: ConfigurableProfile;
  valid: UserValidation;
  submitResult: SubmitResult;
  successMessage: ReactNode;
  onSubmit: () => Promise<void>;
}> = ({ valid, onSubmit, successMessage, submitResult: submitResult }) => {
  const filledCorrectly = Object.values(valid).reduce(
    (prev, cur) => prev && cur,
    true
  );
  return (
    <>
      {(!submitResult || submitResult.status !== "success") && (
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
      {!filledCorrectly && (
        <FormHelperText error>
          フォームが正しく記入されていません
        </FormHelperText>
      )}
      {submitResult?.status === "success" && successMessage}
      {submitResult?.status === "error" && (
        <Alert severity="error">{submitResult.message}</Alert>
      )}
    </>
  );
};

export default Confirm;
