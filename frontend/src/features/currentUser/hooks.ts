import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { logout } from "./operations";

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = useCallback(() => {
    router.push("/login").then(() => dispatch(logout()));
  }, [router, dispatch]);
  return handleLogout;
};
