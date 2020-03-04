import React, { useEffect, useState } from 'react';
import { DefaultLayout } from '../../src/components/layout/DefaultLayout';
import { NextPage } from 'next';
import { getProfile } from '../../src/network';
import { User } from '../../src/user';
import { Typography } from '@material-ui/core';


const Page: NextPage = () => {
  const [myProfile, setMyProfile] = useState<User | null>(null);
  useEffect(() => {
    let unmounted = false;
    (async() => {
      if (!unmounted) {
        setMyProfile(await getProfile());
      }
    })().catch(err => { throw err; });
    return () => { unmounted = true; };
  }, []);
  return (
    <DefaultLayout>
      <Typography>
        プロファイルページが出来ます
        管理者はすべてのプロファイルをみることができるらしいっす
      </Typography>
      {JSON.stringify(myProfile)}
    </DefaultLayout>
  );
};

export default Page;
