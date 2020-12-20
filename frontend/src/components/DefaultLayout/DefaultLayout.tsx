import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const DefaultLayout: React.FC = ({ children }) => {
  return (
    <div className="w-screen">
      <header>
        <Header userName="tosuke" isAdmin />
      </header>
      <main>{children}</main>
      <footer className="my-4">
        <Footer />
      </footer>
    </div>
  );
};
