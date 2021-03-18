import React from "react";
import type { NextPage } from "next";
import { DefaultLayout } from "components/DefaultLayout";
import { useProfile } from "features/profile/useProfile";
import { AccountSettings } from "components/Settings/AccountSettings";

const Profile: NextPage = () => {
  const { profile } = useProfile();

  return (
    <DefaultLayout requireAuth>
      <div className="mx-auto mt-8 w-full max-w-screen-md flex flex-col space-y-4">
        <h2 className="mx-4 text-4xl">設定</h2>
        {profile != null && (
          <AccountSettings
            canEditName={false}
            defaultName={profile.name}
            defaultKana={profile.kana}
            defaultSex={profile.sex}
            defaultPhoneNumber={profile.emergencyPhoneNumber}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default Profile;
