import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_NEWPOST, PROPS_LIKED, PROPS_COMMENT } from "../types";

const apiUrlPost = `${process.env.REACT_APP_DEV_API_URL}api/post/`;
const apiUrlProfile = `${process.env.REACT_APP_DEV_API_URL}api/profile/`;

/*プロフィール情報取得*/
export const fetchAsyncGetProf = createAsyncThunk(
  "profile/get",
  async (userId: string) => {
    const res = await axios.get(`${apiUrlProfile}${userId}`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

/*指定したユーザーの投稿一覧取得*/
export const fetchAsyncGetUserPosts = createAsyncThunk(
  "profile/getUserPosts",
  async (userId: string) => {
    const res = await axios.get(`${apiUrlPost}${userId}`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    /*投稿やコメントをfetchしている時のローディング制御*/
    isLoadingProfile: false,
    profile: {
      id: "",
      nickName: "",
      userProfile: "",
      created_on: "",
      img: "",
    },
  },
  reducers: {
    /*ローディグ管理の制御*/
    fetchPostStart(state) {
      state.isLoadingProfile = true;
    },
    fetchPostEnd(state) {
      state.isLoadingProfile = false;
    },
  },
  /*各reducersの後処理を定義*/
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetProf.fulfilled, (state, action) => {
      /*取得したプロフィール情報をセット*/
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };
    });
    builder.addCase(fetchAsyncGetUserPosts.fulfilled, (state, action) => {
      /*取得したプロフィール情報をセット*/
      return {
        ...state,
        profile: { ...state.profile, userPosts: action.payload },
      };
    });
  },
});

export const { fetchPostStart, fetchPostEnd } = profileSlice.actions;

/* ストアから状態を取得してエクスポート*/
export const selectIsLoadingPost = (state: RootState) =>
  state.profile.isLoadingProfile;
// export const selectOpenNewPost = (state: RootState) =>
// state.profile.openNewPost;
// export const selectPosts = (state: RootState) => state.profile.posts;
// export const selectComments = (state: RootState) => state.profile.comments;

export default profileSlice.reducer;
