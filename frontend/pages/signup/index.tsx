import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { Button } from "@material-ui/core";

const Page: NextPage<{}> = () => {
  return (
    <>
      <p>会員登録方法</p>
      <ol>
        <li>フォームを埋める</li>
        <li>送信される確認メールをチェック</li>
        <li>指定の講座番号へ入会費1000円を振込</li>
        <li>
          <div>
            <p>振込が会計によって確認され次第, 会員登録完了!</p>
            <p>MISWの連絡ツール Slack への招待リンクがメアド宛に送られます!</p>
          </div>
        </li>
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
