import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Router from "next/router";
import Profile from "../src/components/layout/Profile";
import { ConfigurableProfile, PaymentStatus } from "../src/user";
import { getProfile, getPaymentStatuses } from "../src/network";
import PaymentStatuses from "../src/components/layout/PaymentStatuses";
import { Box } from "@material-ui/core";

const Page: NextPage = () => {
  const [user, setUser] = useState<ConfigurableProfile>();
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>();

  useEffect(() => {
    getProfile().then((u) => setUser(u));
    getPaymentStatuses().then((ps) => setPaymentStatuses(ps));
  }, []);
  return (
    <>
      {!user ? (
        "Loading..."
      ) : (
        <Profile
          user={user}
          editButton={true}
          handleEditButton={() => Router.push("/profile/update")}
        />
      )}
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

export default Page;
