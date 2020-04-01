import React from "react";
import { UserForSignUp } from "../../user";
import { Button } from "@material-ui/core";
import { signUp } from "../../network";

const Confirm: React.FC<{
  onSubmit: () => void;
  // TODO: validate-result
}> = (props) => {
  const filled = true; // TODO:
  if (filled) {
    return (
      <Button
        className="button"
        variant="contained"
        color="primary"
        onClick={(e) => {
          e.preventDefault();
          props.onSubmit();
        }}
      >
        提出
      </Button>
    );
  }
  return (
    <>
      <p>Not Filled</p>
    </>
  );
};

export default Confirm;
