import React from "react";
import "styles/index.css";
import type { AppProps } from "next/app";
import { HTTPClientProvider } from "infra/api";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <HTTPClientProvider baseUrl="/api">
      <Component {...pageProps} />
    </HTTPClientProvider>
  );
}
