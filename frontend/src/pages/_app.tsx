import React from "react";
import "tailwindcss/tailwind.css";
import "styles/global.css";
import "focus-visible";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { HTTPClientProvider } from "infra/api";

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <HTTPClientProvider baseUrl="/api">
      <Component {...pageProps} />
    </HTTPClientProvider>
  );
};
export default App;
