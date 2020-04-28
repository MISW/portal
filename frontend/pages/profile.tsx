import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Router from "next/router";
import Profile from "../src/components/layout/Profile";
import { ConfigurableProfile } from "../src/user";
import { getProfile } from "../src/network";

const Page: NextPage = () => {
  const [user, setUser] = useState<ConfigurableProfile>();
  useEffect(() => {
    getProfile().then((u) => setUser(u));
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
    </>
  );
};

export default Page;
