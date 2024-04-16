import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import { fetchAsyncGetProf, fetchAsyncGetUserPosts } from "../api/profileApi";

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
    userPosts: [],
  },
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
  },
});

export const { fetchPostStart, fetchPostEnd, setUserProfileId } =
  profileSlice.actions;

/* ストアから状態を取得してエクスポート*/
export const selectIsLoadingPost = (state: RootState) =>
  state.profile.isLoadingProfile;
export default profileSlice.reducer;
