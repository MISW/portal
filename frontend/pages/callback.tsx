import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { DefaultLayout } from '../src/components/layout/DefaultLayout';
import { useRouter } from 'next/router';
import { Typography } from '@material-ui/core';

const Page: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    const sendStatus = async () => {
      const params =  new URLSearchParams(location.search);
      const code = params.get('code');
      const state = params.get('state');
      if (code === null || state === null) {
        throw new Error('There is no status and code in query parameter');
      }
      const res = await fetch(`${location.protocol}//${location.host}/api/public/callback`, {
        headers: {
          'Accept': 'applicaton/json, */*',
          'Content-type': 'application/json'
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ code, state })
      });
      const body = await res.json();
      if (res.status >= 400) {
        console.error(res);
        throw new Error(`Status >= 400 message = ${body.message}`);
      }
      await router.push('/');
    };
    sendStatus()
      .catch((err) => { throw err;});
  });
  return (
    <DefaultLayout>
      <Typography>Loading...</Typography>
    </DefaultLayout>
  );
};

export default Page;
