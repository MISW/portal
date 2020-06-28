import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useThunk } from "store/helpers";
import { selectCurrentUser } from "./selectors";
import { logout, updateCurrentUser } from "./operations";

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = useCallback(async () => {
    await dispatch(logout());
    router.push("/login");
  }, [router, dispatch]);
  return handleLogout;
};

export const useCurrentUser = () => useSelector(selectCurrentUser);
export const useUpdateCurrentUser = () => useThunk(updateCurrentUser);
