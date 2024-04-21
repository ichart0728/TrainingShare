import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrlPost = `${process.env.REACT_APP_DEV_API_URL}api/posts/`;
const apiUrlProfile = `${process.env.REACT_APP_DEV_API_URL}api/profiles/`;

/*プロフィール情報取得*/
export const fetchAsyncGetProf = createAsyncThunk(
  "profile/get",
  async (userId: string) => {
    const res = await axios.get(`${apiUrlProfile}${userId}/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    /*API側からリスト形式で返ってくるので配列の0番目を取得する*/
    return res.data[0];
  }
);

/*指定したユーザーの投稿一覧取得*/
export const fetchAsyncGetUserPosts = createAsyncThunk(
  "profile/getUserPosts",
  async (userId: string) => {
    const res = await axios.get(`${apiUrlPost}${userId}/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
