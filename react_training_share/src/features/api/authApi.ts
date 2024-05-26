import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  PROPS_AUTHEN,
  PROPS_PUT_PROFILE,
  PROPS_NICKNAME,
  JwtPayload,
} from "../types";
import { jwtDecode } from "jwt-decode";
import { checkTokenExpiryAndRefresh } from "./apiUtils";

const apiUrl = process.env.REACT_APP_DEV_API_URL;

/*JWTトークン取得*/
export const fetchAsyncLogin = createAsyncThunk(
  "auth/post",
  async (authen: PROPS_AUTHEN) => {
    const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const decoded: JwtPayload = jwtDecode(res.data.access);
    const expiryDate = new Date(decoded.exp * 1000);
    localStorage.setItem("localJWT", res.data.access);
    localStorage.setItem("localRefreshToken", res.data.refresh);
    localStorage.setItem("tokenExpiry", expiryDate.toISOString());

    return res.data;
  }
);

/*ユーザー新規作成*/
export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: PROPS_AUTHEN, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${apiUrl}api/register/`, auth, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data);
      }
      throw err;
    }
  }
);

/*プロフィール新規作成*/
export const fetchAsyncCreateProf = createAsyncThunk(
  "profile/post",
  async (nickName: PROPS_NICKNAME) => {
    const token = await checkTokenExpiryAndRefresh();

    const res = await axios.post(`${apiUrl}api/profiles/`, nickName, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
    });
    return res.data;
  }
);

/*プロフィール更新*/
export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/put",
  async (profile: PROPS_PUT_PROFILE) => {
    const token = await checkTokenExpiryAndRefresh();

    const uploadData = new FormData();
    uploadData.append("nickName", profile.nickName);
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.put(
      `${apiUrl}api/profile/${profile.id}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      }
    );
    return res.data;
  }
);

/*プロフィール取得*/
export const fetchAsyncGetMyProf = createAsyncThunk(
  "myprofile/get",
  async () => {
    const token = await checkTokenExpiryAndRefresh();

    const res = await axios.get(`${apiUrl}api/profiles/`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    return res.data[0];
  }
);

/*プロフィール一覧取得*/
export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
  const token = await checkTokenExpiryAndRefresh();

  const res = await axios.get(`${apiUrl}api/profiles/`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return res.data;
});
