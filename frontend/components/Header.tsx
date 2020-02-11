import Link from 'next/link'

const linkStyle = {
    marginRight: 15
};

const Header = () => (
    <div>
        <Link href="/">
            <a style={linkStyle}>Home</a>
        </Link>
        <Link href="/links">
            <a style={linkStyle}>Links</a>
        </Link>
        <Link href="/setting">
            <a style={linkStyle}>会員情報設定</a>
        </Link>
    </div>
);

export default Header;
