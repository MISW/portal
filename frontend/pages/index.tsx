import Layout from '../components/Layout'
import Link   from 'next/link'

const Index = () => (
    <Layout>
        <h1>ここにすばらしいポータルサイトができます</h1>
        <Link href="/links">
            <a title="links">MISW便利リンクまとめ</a>
        </Link>
    </Layout>
);

export default Index;
