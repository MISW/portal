import React from "react";
import type { NextPage } from "next";
import { DefaultLayout } from "components/DefaultLayout";
import { Caption } from "components/ui";

const Profile: NextPage = () => {
  return (
    <DefaultLayout requireAuth>
      <div className="mx-auto mt-8 px-8 w-full max-w-screen-md flex flex-col space-y-4">
        <h2 className="text-xl">プロフィール</h2>
        <section>
          <h3 className="text-blue-400">基本情報</h3>
        </section>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
