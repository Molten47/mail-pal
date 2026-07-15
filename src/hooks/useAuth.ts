import { useDispatch } from "react-redux";
import { setAuth, clearAuth } from "@/store/authSlice";
import { getUserId, isAuthenticated, clearAuth as clearCookies } from "@/lib/auth";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();

const loginWithGoogle = () => {
  window.location.href = "/api/auth/google/login";
};

  const logout = async () => {
    await clearCookies();
    dispatch(clearAuth());
    window.location.href = "/";
  };

  const initAuth = () => {
    if (isAuthenticated()) {
      const userId = getUserId() ?? "";
      dispatch(setAuth({ userId, accessToken: "cookie" }));
    }
  };

  useEffect(() => { initAuth(); }, []);

  return { loginWithGoogle, logout, initAuth };
};