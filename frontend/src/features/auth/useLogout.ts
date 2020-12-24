import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import ky from "ky-universal";
import { useHTTPClient } from "infra/api";

export const useLogout = () => {
  const [error, setError] = useState<unknown>();
  const http = useHTTPClient();
  const router = useRouter();
  const logout = useCallback(async () => {
    try {
      await http.post("private/logout", { json: {} });
      await router.push("/login");
    } catch (e) {
      if (e instanceof ky.HTTPError) {
        const json = await e.response.json();
        setError(json);
      } else {
        setError(e);
      }
    }
  }, [http, router]);

  return {
    logout,
    error,
  } as const;
};
