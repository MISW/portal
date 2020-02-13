import React from "react";
import { Header } from "./Header";

export const DefaultLayout: React.FC = ({ children }) => (
  <>
    <style jsx>{`
      .container {
        margin: 20;
        padding: 20;
        border: 1px solid #000;
      }
    `}</style>
    <div className="container">
      <Header />
      {children}
    </div>
  </>
);
