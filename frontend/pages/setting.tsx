import React from "react";
import { NextPage } from "next";
import { DefaultLayout } from "../components/layout/DefaultLayout";

const Page: NextPage = () => (
  <DefaultLayout>
    <h1>会員情報設定</h1>
    ここにすばらしい会員登録フォームができます!
  </DefaultLayout>
);

export default Page;
