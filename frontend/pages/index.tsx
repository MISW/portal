import React from "react";
import { NextPage } from "next";
import { DefaultLayout } from "../components/layout/DefaultLayout";
import Link from "next/link";
import Button from "@material-ui/core/Button";

const Page: NextPage = () => (
  <DefaultLayout>
    <h1>ここにすばらしいポータルサイトができます</h1>
    <Link href="/links">
      <Button className="button" variant="contained" color="primary">
        MISW便利リンクまとめ
      </Button>
    </Link>
    <Link href="/setting">
      <Button className="button" variant="contained" color="primary">
        会員情報設定
      </Button>
    </Link>
  </DefaultLayout>
);

export default Page;
