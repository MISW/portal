import React from "react";
import type { NextPage } from "next";
import { Caption } from "components/ui";
import { DefaultLayout } from "components/DefaultLayout";

type LinkCardProps = Readonly<{
  title: string;
  description: string;
  url: string;
}>;
const LinkCard: React.VFC<LinkCardProps> = ({ title, description, url }) => (
  <a
    className="rounded-md bg-white dark:bg-gray-800 border dark:border-0 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
    href={url}
    target="_blank"
    rel="noreferrer noopener"
  >
    <div className="h-full p-4 flex flex-col space-y-2">
      <h4 className="text-2xl font-semibold">{title}</h4>
      <h5 className="text-sm">
        <Caption>{url}</Caption>
      </h5>
      <p>{description}</p>
    </div>
  </a>
);

const Home: NextPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto mt-8 px-8 w-full max-w-screen-lg flex flex-col items-center space-y-4">
        <h2 className="text-4xl md:text-5xl">Welcome to MISW!</h2>
        {/* 入会完了後のフローとして終わっているのでなんとかする */}
        <section>
          <h3 className="text-xl font-bold text-center">Getting Started</h3>
          <ol className="mt-4 list-decimal list-inside">
            <li>slackの情報を登録</li>
            <li>kibelaの自己紹介記事を書く</li>
            <li>活動/ディスコードにてサークル員と交流する</li>
            <li>新歓講座に参加する</li>
            <li>発表会に参加する</li>
            <li>企画に参加する/企画を立ち上げる</li>
            <li>その他イベントに参加する/イベントを企画する</li>
            <li>
              上記活動を通してインスピレーションを得て未来の創作につなげる
            </li>
          </ol>
        </section>
        <section>
          <h3 className="text-xl font-bold text-center">Useful Links</h3>
          <div className="mt-4 grid gap-4 place-items-stretch grid-cols-1 md:grid-cols-2">
            <LinkCard
              title="Slack"
              description="主な連絡ツール。大事な連絡はこれで送られます"
              url="https://misw-info.slack.com"
            />
            <LinkCard
              title="Discord"
              description="ボイスチャット 2020春はここで"
              url="https://discord.com/invite/bEtrsRX"
            />
            <LinkCard
              title="Twitter"
              description="サークル員の生息地 MISWと検索してフォローを!"
              url="https://twitter.com/misw_info"
            />
            <LinkCard
              title="Kibela"
              description="サークル員専用ブログ兼資料置き場"
              url="https://misw.kibe.la"
            />
            <LinkCard
              title="みすクラウド"
              description="サークル員専用クラウド"
              url="https://cloud.misw.jp"
            />
            <LinkCard
              title="misw.jp"
              description="公式ホームページ"
              url="https://misw.jp"
            />
            <LinkCard
              title="blog.misw.jp"
              description="サークル員による外部公開ブログ"
              url="https://blog.misw.jp"
            />
            <LinkCard
              title="misw.github.io"
              description="主にプロ研の入門記事置き場"
              url="https://misw.github.io"
            />
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
};

export default Home;
