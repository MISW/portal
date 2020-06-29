import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { logout } from "features/currentUser";

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = useCallback(async () => {
    await dispatch(logout());
    router.push("/login");
  }, [router, dispatch]);
  return handleLogout;
};
