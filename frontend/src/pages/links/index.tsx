import { NextPage } from 'next';
import { withLogin } from 'middlewares/withLogin';

// TODO: よくわからんページ。何もないなら消す

const Page: NextPage = () => {
  return (
    <>
      <h1>MISW便利リンクまとめ</h1>
      <ul>
        <li>
          <a title="misw.jp" href="https://misw.jp">
            MISW公式ホームページ misw.jp
          </a>
        </li>
        <li>
          <a title="cloud.misw.jp" href="https://cloud.misw.jp">
            みすくらうど
          </a>
        </li>
        <li>
          <a title="misw.kibe.la" href="https://misw.kibe.la">
            MISW Kibela
          </a>
        </li>
      </ul>
    </>
  );
};

export default withLogin(Page);
