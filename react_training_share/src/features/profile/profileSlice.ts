import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import { fetchAsyncGetProf } from "../api/profileApi";
import { fetchAsyncGetUserPosts } from "../api/postApi";

import { logout } from "../auth/authSlice";
import { ProfileState } from "../types";

const initialState: ProfileState = {
  isLoadingProfile: false,
  profile: {
    id: "",
    nickName: "",
    userProfile: "",
    created_on: "",
    img: "",
    userPosts: [],
  },
  userPosts: [
    {
      id: "",
      userPost: "",
      img: "",
      created_on: "",
    },
  ],
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    /*ローディグ管理の制御*/
    fetchPostStart(state) {
      state.isLoadingProfile = true;
    },
    fetchPostEnd(state) {
      state.isLoadingProfile = false;
    },
    setUserProfileId: (state, action: PayloadAction<string>) => {
      state.profile.id = action.payload;
    },
  },
  /*各reducersの後処理を定義*/
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetProf.pending, (state) => {
      state.isLoadingProfile = true;
    });
    builder.addCase(fetchAsyncGetProf.fulfilled, (state, action) => {
      /*取得したプロフィール情報をセット*/
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
      state.isLoadingProfile = false;
    });
    builder.addCase(fetchAsyncGetUserPosts.pending, (state) => {
      state.isLoadingProfile = true;
    });
    builder.addCase(fetchAsyncGetUserPosts.fulfilled, (state, action) => {
      /*取得したプロフィール情報をセット*/
      state.userPosts = action.payload;
      state.isLoadingProfile = false;
    });
    builder.addCase(logout, () => initialState);
  },
});

export const { fetchPostStart, fetchPostEnd, setUserProfileId } =
  profileSlice.actions;

/* ストアから状態を取得してエクスポート*/
export const selectIsLoadingPost = (state: RootState) =>
  state.profile.isLoadingProfile;
export default profileSlice.reducer;
