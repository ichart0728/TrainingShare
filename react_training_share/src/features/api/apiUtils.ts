import { store } from "../../app/store";
import axios, { AxiosError } from "axios";
import { logout } from "../auth/authSlice";
import { JwtPayload } from "../types";
import { jwtDecode } from "jwt-decode";

const apiUrl = process.env.REACT_APP_DEV_API_URL;

const fetchAsyncRefreshToken = async () => {
  const refresh = localStorage.getItem("localRefreshToken");
  if (refresh) {
    try {
      const res = await axios.post(
        `${apiUrl}authen/jwt/refresh`,
        { refresh },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const decoded: JwtPayload = jwtDecode(res.data.access);
      const expiryDate = new Date(decoded.exp * 1000);
      localStorage.setItem("localJWT", res.data.access);
      localStorage.setItem("tokenExpiry", expiryDate.toISOString());
      return res.data.access;
    } catch (error) {
      store.dispatch(logout());
      alert("セッションがタイムアウトしました。再度ログインしてください。");
      return null;
    }
  }
  return null;
};

export const checkTokenExpiryAndRefresh = async () => {
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  if (tokenExpiry) {
    const expiryDate = new Date(tokenExpiry);

    if (expiryDate < new Date()) {
      return await fetchAsyncRefreshToken();
    }
    return localStorage.getItem("localJWT");
  }
  return null;
};
