import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NextPage } from "next";
import Router from "next/router";
import Profile from "components/layout/Profile";
import PaymentStatuses from "components/layout/PaymentStatuses";
import { Box } from "@material-ui/core";
import { withLogin } from "middlewares/withLogin";
import {
  selectCurrentUser,
  selectCurrentPaymentStatuses,
  fetchCurrentPaymentStatuses,
} from "features/currentUser";
import { nonNullOrThrow } from "utils";

const Page: NextPage = () => {
  const dispatch = useDispatch();
  const currentUser = nonNullOrThrow(useSelector(selectCurrentUser));
  const paymentStatuses = useSelector(selectCurrentPaymentStatuses);
  useEffect(() => {
    dispatch(fetchCurrentPaymentStatuses());
  }, [dispatch]);

  return (
    <>
      <Profile
        user={currentUser}
        editButton={true}
        handleEditButton={() => Router.push("/profile/update")}
      />
      <Box mt={6}>
        {paymentStatuses != null && (
          <PaymentStatuses
            paymentStatuses={paymentStatuses}
            editButton={false}
          />
        )}
      </Box>
    </>
  );
};

export default withLogin(Page);
