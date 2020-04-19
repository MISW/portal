import React, { useMemo } from "react";
import { NextPage } from "next";
import { Typography, Grid, Container } from "@material-ui/core";
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
        link: "https://discord.gg/7e3qqqj",
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
      {
        title: "misw.github.io",
        description: "主にプロ研の入門記事置き場",
        link: "https://misw.github.io",
      },
    ],
    []
  );
  return (
    <>
      <Typography variant="h2">
        Create MISW <br /> with your own hand.
      </Typography>
      <p>Welcome to MISW!</p>

      <Typography variant="h6">Getting Started</Typography>
      <ol>
        <li>slackの情報を登録</li>
        <li>kibelaの自己紹介記事を書く</li>
        <li>活動/ディスコードにてサークル員と交流する</li>
        <li>新歓講座に参加する</li>
        <li>発表会に参加する</li>
        <li>企画に参加する/企画を立ち上げる</li>
        <li>その他イベントに参加する/イベントを企画する</li>
        <li>上記活動を通してインスピレーションを得て未来の創作につなげる</li>
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
