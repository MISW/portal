import React from "react";
import { UserForSignUp } from "../../user";
import { Button } from "@material-ui/core";
import { signUp } from "../../network";

const Confirm: React.FC<{
  user: UserForSignUp;
}> = ({ user }) => {
  const filled = true; // TODO:
  const handleClick = () =>
    signUp(user as UserForSignUp)
      .then(() => console.log("signUp!"))
      .catch((err) => console.error(err));
  if (filled) {
    return (
      <Button className="button" variant="contained" color="primary" onClick={handleClick}>
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
