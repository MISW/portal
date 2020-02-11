import Layout from '../components/Layout'
import Link   from 'next/link'
import Button from '@material-ui/core/Button';

const Index = () => (
    <Layout>
        <h1>ここにすばらしいポータルサイトができます</h1>
        <Link href="/links">
            <Button variant="contained" color="primary">
                MISW便利リンクまとめ
            </Button>
        </Link>
        <Link href="/setting">
            <Button variant="contained" color="primary">
                会員情報設定
            </Button>
        </Link>
    </Layout>
);

export default Index;
