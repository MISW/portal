import React from 'react';
import { NextPage } from 'next';
import { DefaultLayout } from '../src/components/layout/DefaultLayout';

const Page: NextPage = () => {
  React.useEffect(() => {
    const sendStatus = async () => {
      const params =  new URLSearchParams(location.search);
      const code = params.get('code');
      const state = params.get('state');
      if (code === null || state === null) {
        console.error('failed to authorize');
        return;
      }
      const res = await fetch(`${location.protocol}//${location.host}/api/public/callback`, {
        headers: {
          'Accept': 'applicaton/json, */*',
          'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ code, state })
      });
      const json = await res.json()
        .catch( err => console.error(err));
      console.error(json.message);
      if (res.status >= 400) {
        return;
      }
    };
    sendStatus();
  });
  return (
    <DefaultLayout>
    </DefaultLayout>
  );
};

export default Page;
