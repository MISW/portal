import React, { useMemo } from "react";
import { NextPage } from "next";
import { Typography, Grid } from "@material-ui/core";
import LinkContentCard from "../src/components/design/LinkContentCard";

const Page: NextPage = () => {
  interface LinkData {
    title: string;
    description: string;
    link: string;
    image?: string;
  }
  const linkData = useMemo(
    (): Array<LinkData> => [
      {
        title: "Slack",
        description: "主な連絡ツール",
        link: "https://misw-info.slack.com",
      },
      {
        title: "Discord",
        description: "ボイスチャット 2020春はここで",
        link: "TODO:",
      },
      {
        title: "Kibela",
        description: "サークル員専用ブログ, 資料置き場",
        link: "https://misw.kibe.la",
      },
      {
        title: "みすクラウド",
        description: "サークル員専用クラウド",
        link: "https://cloud.misw.jp",
      },
      {
        title: "misw.jp",
        description: "公式ホームページ",
        link: "https://misw.jp",
      },
      {
        title: "blog.misw.jp",
        description: "サークル員による外部公開ブログ",
        link: "https://blog.misw.jp",
      },
    ],
    []
  );
  return (
    <>
      <Grid container></Grid>
      <Typography variant="h2">
        Create MISW
        <br /> with your own hand.
      </Typography>
      <p>Welcome to MISW!</p>

      <p>MISWでまず何をすべきかを書きたい</p>
      <ol>
        <li>slackの情報を登録</li>
        <li>kibelaの自己紹介記事を書く</li>
        <li>ディスコードにてサークル員と交流する</li>
        <li>新歓講座に参加する</li>
        <li>発表会に参加する</li>
        <li>企画に参加する/企画を立ち上げる</li>
        <li>その他イベントに参加する/イベントを企画する</li>
        <li>活動を通してインスピレーションを得て未来の創作につなげる</li>
      </ol>
      <Typography variant="h6">Useful Links</Typography>
      <Grid container spacing={4}>
        {linkData.map((data, i) => (
          <LinkContentCard {...data} key={i} />
        ))}
      </Grid>
    </>
  );
};

export default Page;
