import * as React from 'react';
import { NextPage } from 'next';
import { NoSSR } from 'components/utils/NoSSR';
import { Typography } from '@mui/material';

const Chapter: React.FC<
  React.PropsWithChildren<{
    chapter: string;
    descriptions: string[];
  }>
> = ({ chapter, descriptions }) => {
  return (
    <div style={{ marginTop: 30 }}>
      <Typography variant="h5" margin={1}>
        <strong>{chapter}</strong>
      </Typography>
      {descriptions.map((d, i) => (
        <p key={i}>{d}</p>
      ))}
    </div>
  );
};

const Page: NextPage = () => {
  return (
    <NoSSR>
      <div style={{ margin: 10 }}>
        <Typography variant="h5" margin={1}>
          <strong>プライバシーポリシー</strong>
        </Typography>
        <div>
          <p>
            経営情報学会MIS.W（以下，「当サークル」といいます。）は，本ウェブサイト上で提供するサービス（以下,「本サービス」といいます。）における，ユーザーの個人情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。
          </p>
        </div>
        <Chapter
          chapter="個人情報の収集方法"
          descriptions={[
            '当サークルは，ユーザーが本サービスに利用登録をする際に「大学名、氏名、電話番号、XXX...」などの個人情報をお尋ねすることがあります。また、XXXなどから個人情報を収集することがあります。',
          ]}
        />
        <Chapter
          chapter="個人情報を収集・利用する目的"
          descriptions={[
            '当サークルが個人情報を収集・利用する目的は，以下のとおりです。',
            '　・当サークル内サービスにおけるアカウント管理に利用するため',
            '　・大学へ提出する資料に記載するため',
            '　・XXX',
          ]}
        />
        <Chapter chapter="個人情報の第三者への開示・提供" descriptions={['・XXXのために大学に提供する', '・XXX']} />
        <Chapter
          chapter="プライバシーポリシーの変更"
          descriptions={[
            '本ポリシーの内容は，法令その他本ポリシーに別段の定めのある事項を除いて，ユーザーに通知することなく，変更することができるものとします。',
            '当サークルが別途定める場合を除いて，変更後のプライバシーポリシーは，本ウェブサイトに掲載したときから効力を生じるものとします。',
          ]}
        />
        <Chapter
          chapter="免責事項"
          descriptions={[
            '利用上の不具合・不都合に対して可能な限りサポートを行っておりますが、利用者が本アプリを利用して生じた損害に関して、開発元は責任を負わないものとします、的な文章。',
          ]}
        />
        <Chapter chapter="お問い合わせ" descriptions={['twitterやメールなど']} />
        <Chapter chapter="その他なにかあれば追加していただいてXXX" descriptions={['XXXXXX']} />
        <br />
      </div>
    </NoSSR>
  );
};

export default Page;
