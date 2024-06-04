import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  PROPS_AUTHEN,
  PROPS_PUT_PROFILE,
  PROPS_NICKNAME,
  PROPS_LOGIN_RESPONSE,
} from "../types";
import Cookies from "universal-cookie";

const apiUrl = process.env.REACT_APP_DEV_API_URL;
const cookies = new Cookies();

export const fetchToken = async (email: string, password: string) => {
  const res = await axios.post(
    `${apiUrl}api/token/`,
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // クッキーを送受信するためにwithCredentialsをtrueに設定
    }
  );
  return res.data;
};

/*JWTトークン取得*/
export const fetchAsyncLogin = createAsyncThunk<
  PROPS_LOGIN_RESPONSE,
  PROPS_AUTHEN
>("auth/post", async (authen: PROPS_AUTHEN) => {
  const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
    headers: {
      "Content-Type": "application/json",
    },
    // withCredentials: true,
  });
  return res.data;
});

/*ユーザー新規作成*/
export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: PROPS_AUTHEN, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${apiUrl}api/register/`, auth, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${cookies.get("accesstoken")}`,
        },
        withCredentials: true,
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
    const res = await axios.post(`${apiUrl}api/profiles/`, nickName, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${cookies.get("accesstoken")}`,
      },
      withCredentials: true,
    });
    return res.data;
  }
);

/*プロフィール更新*/
export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/put",
  async (profile: PROPS_PUT_PROFILE) => {
    const uploadData = new FormData();
    uploadData.append("nickName", profile.nickName);
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.put(
      `${apiUrl}api/profile/${profile.id}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${cookies.get("accesstoken")}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);

/*プロフィール取得*/
export const fetchAsyncGetMyProf = createAsyncThunk(
  "myprofile/get",
  async () => {
    const res = await axios.get(`${apiUrl}api/profiles/`, {
      headers: {
        Authorization: `JWT ${cookies.get("accesstoken")}`,
      },
      withCredentials: true,
    });
    return res.data[0];
  }
);

/*プロフィール一覧取得*/
export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
  const res = await axios.get(`${apiUrl}api/profiles/`, {
    headers: {
      Authorization: `JWT ${cookies.get("accesstoken")}`,
    },
    withCredentials: true,
  });
  return res.data;
});
