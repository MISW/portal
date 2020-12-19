import React from "../src_furui/react";
import { NextPage } from "../src_furui/next";
import Link from "../src_furui/next/link";
import { Button } from "../src_furui/@material-ui/core";

const Page: NextPage<{}> = () => {
  return (
    <>
      <p>会員登録方法</p>
      <ol>
        <li>フォームを埋める</li>
        <li>確認メールをチェック</li>
        <li>指定の口座番号へ入会費1000円を振込</li>
        <li>振込が確認され次第, 会員登録完了! </li>
        <li>MISWの連絡ツール Slack への招待リンクがメアド宛に送られます!</li>
      </ol>
      <Link href="/signup/form">
        <Button color="primary" variant="contained">
          会員登録フォームへ
        </Button>
      </Link>
    </>
  );
};

export default Page;
