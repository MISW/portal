import React from 'react';
import { DefaultLayout } from '../src/components/layout/DefaultLayout';
import NextLink from 'next/link';
import Button from '@material-ui/core/Button';
import { NextPage } from 'next';

const Page: NextPage = () => {
  React.useEffect( () => {
    (async () => {
      // TODO:
      // const getProfile = await fetch(`${location.protocol}//${location.host}/api/public/profile`, {
      //   headers: {
      //     'Accept': 'applicaton/json, */*',
      //     'Content-type': 'application/json'
      //   },
      //   method: 'POST'
      // });

      const tryLogin = async () => {
        const res = await fetch(`${location.protocol}//${location.host}/api/public/login`, {
          headers: {
            'Accept': 'applicaton/json, */*',
            'Content-type': 'application/json'
          },
          method: 'POST'
        });
        if (res.status >= 400) {
          console.error(res);
          return;
        }
        const json = await res.json()
          .catch((err) => console.error(err));
        location.href = json.redirect_url;
      };
      // TODO:
      // if (getProfile.status >= 400) {
      //   tryLogin();
      // }
    })();
  });
  return (
    <DefaultLayout>
      <h1>ここにすばらしいポータルサイトができます</h1>
      <NextLink href="/setting">
        <Button className="button" variant="contained" color="primary">
          会員情報設定
        </Button>
      </NextLink>
    </DefaultLayout>
  );
};

export default Page;
