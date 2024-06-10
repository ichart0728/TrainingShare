import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import {
  fetchAsyncCreateProf,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchAsyncUpdateProf,
  fetchAsyncSendPasswordResetEmail,
} from "../api/authApi";
import { getAuth, signOut } from "firebase/auth";

import { PROPS_AUTH_STATE } from "../types";
const initialState: PROPS_AUTH_STATE = {
  /*サインイン用モーダル管理*/
  openSignIn: true,
  /*サインアップ用モーダル管理*/
  openSignUp: false,
  /*プロフィール用モーダル管理*/
  openProfile: false,
  /*パスワードリセット用モーダル管理*/
  openForgotPassword: false,
  /*パスワードリセット確認用モーダル管理*/
  openForgotPasswordConfirmation: false,
  /*ローディグ管理*/
  isLoadingAuth: false,
  /*ログインユーザーの状態*/
  myprofile: {
    id: "",
    nickName: "",
    userProfile: "",
    created_on: "",
    img: "",
  },
  /*プロフィール一覧格納用*/
  profiles: [
    {
      id: "",
      nickName: "",
      userProfile: "",
      created_on: "",
      img: "",
      gender: "",
      height: 0,
      dateOfBirth: "",
      userPosts: [],
    },
  ],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* ... */
    setOpenForgotPassword(state) {
      state.openForgotPassword = true;
    },
    resetOpenForgotPassword(state) {
      state.openForgotPassword = false;
    },
    setOpenForgotPasswordConfirmation(state) {
      state.openForgotPasswordConfirmation = true;
    },
    resetOpenForgotPasswordConfirmation(state) {
      state.openForgotPasswordConfirmation = false;
    },
    fetchCredStart(state) {
      state.isLoadingAuth = true;
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false;
    },
    /*サインインモーダルの制御*/
    setOpenSignIn(state) {
      state.openSignIn = true;
    },
    resetOpenSignIn(state) {
      state.openSignIn = false;
    },
    /*サインアップ用モーダルの制御*/
    setOpenSignUp(state) {
      state.openSignUp = true;
    },
    resetOpenSignUp(state) {
      state.openSignUp = false;
    },
    /*プロフィール用モーダル管理の制御*/
    setOpenProfile(state) {
      state.openProfile = true;
    },
    resetOpenProfile(state) {
      state.openProfile = false;
    },
    /*プロフィールのニックネーム編集制御*/
    editNickname(state, action) {
      state.myprofile.nickName = action.payload;
    },
    logout(state) {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          console.log("User signed out successfully");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });

      return initialState; // ログアウト時に初期状態にリセット
    },
  },
  /*各reducersの後処理を定義*/
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    /*取得したプロフィールをログインユーザーの状態としてセット*/
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    /*取得したプロフィール一覧をセット*/
    builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    /*更新したプロフィールをセット*/
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
      state.profiles = state.profiles.map((prof) =>
        prof.id === action.payload.id ? action.payload : prof
      );
    });
    builder.addCase(fetchAsyncSendPasswordResetEmail.fulfilled, (state) => {
      state.openForgotPassword = false;
    });
  },
});

export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenForgotPassword,
  resetOpenForgotPassword,
  setOpenForgotPasswordConfirmation,
  resetOpenForgotPasswordConfirmation,
  setOpenProfile,
  resetOpenProfile,
  editNickname,
  logout,
} = authSlice.actions;

/* ストアから状態を取得してエクスポート*/
export const selectIsLoadingAuth = (state: RootState) =>
  state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectMyProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;
export const selectOpenForgotPassword = (state: RootState) =>
  state.auth.openForgotPassword;
export const selectOpenForgotPasswordConfirmation = (state: RootState) =>
  state.auth.openForgotPasswordConfirmation;

export default authSlice.reducer;
