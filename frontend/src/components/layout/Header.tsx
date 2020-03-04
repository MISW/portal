import React from "react";
import Link from "next/link";

export const Header: React.FC = () => (
  <>
    <style jsx>{`
      .link:first-child {
        margin-left: 0px;
      }
      .link {
        margin-left: 15px;
      }
    `}</style>
    <div>
      <Link href="/">
        <a className="link">Home</a>
      </Link>
      <Link href="/links">
        <a className="link">Links</a>
      </Link>
      <Link href="/setting">
        <a className="link">会員情報設定</a>
      </Link>
    </div>
  </>
);
