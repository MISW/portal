import React, { useContext } from "react";
import { Typography, Grid, Button, Paper, makeStyles } from "@material-ui/core";
import LinkContentCard from "../src/components/design/LinkContentCard";
import { NextPage } from "next";
import { accountInfoContext } from "./_app";
import { Alert, AlertTitle } from "@material-ui/lab";

interface LinkData {
  title: string;
  description: string;
  link: string;
  image?: string;
}

const linkData: Array<LinkData> = [
  {
    title: "Slack",
    description: "主な連絡ツール. 大事な連絡はこれで送られます",
    link: "https://misw-info.slack.com",
  },
  {
    title: "Discord",
    description: "ボイスチャット 2020春はここで",
    link: "https://discord.gg/7e3qqqj",
  },
  {
    title: "Twitter",
    description: "サークル員の生息地 MISWと検索してフォローを!",
    link: "https://twitter.com/misw_info",
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
];

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(2),
    },
  },
}));

const Page: NextPage = () => {
  const accountInfo = useContext(accountInfoContext);

  const classes = useStyles();
  if (
    accountInfo &&
    accountInfo.role === "not_member" &&
    accountInfo.email_verified
  ) {
    return (
      <div>
        <Paper className={classes.paper}>
          <Alert severity="warning">
            <AlertTitle>まだ会員登録は終わっていません！</AlertTitle>
            会費を払うことで会員として各種サービスを利用出来ます。
          </Alert>
          <p>新入会希望者は入会費1000円を以下の口座へ振り込んでください。</p>
          <p>
            振込が確認され次第, メール宛にサークル内の連絡ツール
            <strong>Slack</strong>の招待が届きます!
          </p>
          <div>
            <ul>
              <li>銀行名：株式会社みずほ銀行</li>
              <li>支店名：高田馬場支店(店番号：064)</li>
              <li>普通預金</li>
              <li>口座番号：0519948</li>
              <li>口座名義：ｹｲｴｲｼﾞﾖｳﾎｳｶﾞﾂｶｲ(MISW)</li>
              <li>振込依頼人名：自分の名前</li>
            </ul>
          </div>

          <Alert severity="error">
            もし振込から1週間以上経ってもSlack招待が確認出来ない場合は
            <ul>
              <li>メール info@misw.jp</li>
              <li>Twitter @misw_info</li>
            </ul>
            のいずれかへその由を伝えてください。
          </Alert>
          <Alert severity="info">
            会費は部室の備品購入やコミケなどへの参加費用等に使われます。
          </Alert>
        </Paper>
      </div>
    );
  }
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

// Page.getInitialProps = async ({
//   res,
//   userInfo,
// }: NextPageContext & { userInfo?: UserAllInfoJSON }) => {
//   // use userInfo
// };

export default Page;
