import { useCallback, useState } from "react";
import { useHTTPClient } from "infra/api";
import { saveState } from "./restoreState";

export const useLogin = () => {
  const [error, setError] = useState<unknown>();
  const http = useHTTPClient();

  const login = useCallback(
    async (continuePath?: string) => {
      try {
        const { redirect_url: redirectUrl } = await http
          .post("public/login", { json: {} })
          .json<{ redirect_url: string }>();

        if (continuePath != null) {
          saveState(continuePath);
        }

        location.href = redirectUrl;
      } catch (e) {
        setError(e);
      }
    },
    [http]
  );

  return {
    login,
    error,
  } as const;
};
