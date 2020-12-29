import ky from "ky-universal";
import type { Options } from "ky";
import { createContext, createElement, useContext, useMemo } from "react";

type HTTPClient = typeof ky;
export const HTTPClientContext = createContext<HTTPClient | null>(null);
if (process.env.NODE_ENV === "development") {
  HTTPClientContext.displayName = "HTTPClientContext";
}

export const useHTTPClient = (): HTTPClient => {
  const http = useContext(HTTPClientContext);
  if (http == null) throw new Error("don't call out of HTTPClientContext");
  return http;
};

type HTTPClientProviderProps = {
  baseUrl: string;
  options?: Options;
};
export const HTTPClientProvider: React.FC<HTTPClientProviderProps> = ({
  children,
  baseUrl,
  options,
}) => {
  const http = useMemo(
    () => ky.create({ prefixUrl: baseUrl, credentials: "include", ...options }),
    [baseUrl, options]
  );
  return createElement(HTTPClientContext.Provider, { value: http }, children);
};
