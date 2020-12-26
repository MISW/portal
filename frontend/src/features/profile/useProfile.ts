import useSWR from "swr";
import type { User } from "models/user";
import { useHTTPClient } from "infra/api";
import { toCamelCase } from "infra/converter";

export const useProfile = () => {
  const http = useHTTPClient();
  const { data: profile, error, revalidate } = useSWR("profile", async () => {
    const json = await http.get("private/profile").json();
    return toCamelCase(json) as User;
  });

  return {
    profile,
    error,
    revalidate,
  } as const;
};
