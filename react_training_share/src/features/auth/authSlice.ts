import { createSlice, createAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import {
  fetchAsyncLogin,
  fetchAsyncCreateProf,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchAsyncUpdateProf,
} from "../api/authApi";

interface MyProfile {
  id: string;
  nickName: string;
  userProfile: string;
  created_on: string;
  img: string;
}
interface Profile {
  id: string;
  nickName: string;
  userProfile: string;
  created_on: string;
  img: string;
}
interface AuthState {
  /*サインイン用モーダル管理*/
  openSignIn: boolean;
  /*サインアップ用モーダル管理*/
  openSignUp: boolean;
  /*プロフィール用モーダル管理*/
  openProfile: boolean;
  /*ローディグ管理*/
  isLoadingAuth: boolean;
  /*ログインユーザーの状態*/
  myprofile: MyProfile;
  /*プロフィール一覧格納用*/
  profiles: Profile[];
}

const initialState: AuthState = {
  /*サインイン用モーダル管理*/
  openSignIn: true,
  /*サインアップ用モーダル管理*/
  openSignUp: false,
  /*プロフィール用モーダル管理*/
  openProfile: false,
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
    },
  ],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /*ローディグ管理の制御*/
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
  },
  /*各reducersの後処理を定義*/
  extraReducers: (builder) => {
    /*ログイン後、JWTトークンをローカルストレージに保管する*/
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem("localJWT", action.payload.access);
    });
    /*作成したプロフィールをログインユーザーの状態としてセット*/
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
    builder.addCase(resetAllStates, () => {
      return initialState;
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
  setOpenProfile,
  resetOpenProfile,
  editNickname,
} = authSlice.actions;

/* ストアから状態を取得してエクスポート*/
export const selectIsLoadingAuth = (state: RootState) =>
  state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectMyProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;
