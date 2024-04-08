import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_AUTHEN, PROPS_PROFILE, PROPS_NICKNAME } from "../types";

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
    return res.data;
  }
);

/*ユーザー新規作成*/
export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: PROPS_AUTHEN) => {
    const res = await axios.post(`${apiUrl}api/register/`, auth, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

/*プロフィール新規作成*/
export const fetchAsyncCreateProf = createAsyncThunk(
  "profile/post",
  async (nickName: PROPS_NICKNAME) => {
    const res = await axios.post(`${apiUrl}api/profile/`, nickName, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

/*プロフィール更新*/
export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/put",
  async (profile: PROPS_PROFILE) => {
    const uploadData = new FormData();
    uploadData.append("nickName", profile.nickName);
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.put(
      `${apiUrl}api/profile/${profile.id}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
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
    const res = await axios.get(`${apiUrl}api/myprofile/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data[0];
  }
);

/*プロフィール一覧取得*/
export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
  const res = await axios.get(`${apiUrl}api/profile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState: {
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
  }, // The 'reducers' field lets us define reducers and generate associated actions
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
export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;
