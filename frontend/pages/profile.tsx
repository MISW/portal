import React, { useEffect, useState } from "react";
import Router from "next/router";
import Profile from "../src/components/layout/Profile";
import { PaymentStatus } from "../src/user";
import { getPaymentStatuses } from "../src/network";
import PaymentStatuses from "../src/components/layout/PaymentStatuses";
import { Box } from "@material-ui/core";
import { withLogin, NextPageWithUserInfo } from "../src/middlewares/withLogin";

const Page: NextPageWithUserInfo = ({ currentUser }) => {
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>();

  useEffect(() => {
    getPaymentStatuses().then((ps) => setPaymentStatuses(ps));
  }, []);
  return (
    <>
      <Profile
        user={currentUser}
        editButton={true}
        handleEditButton={() => Router.push("/profile/update")}
      />
      <Box mt={6}>
        {!paymentStatuses ? (
          ""
        ) : (
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
