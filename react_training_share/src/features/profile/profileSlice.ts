import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import {
  fetchAsyncGetProf,
  fetchAsyncListWeightHistory,
  fetchAsyncListBodyFatPercentageHistory,
  fetchAsyncListMuscleMassHistory,
} from "../api/profileApi";
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
    gender: "",
    height: 0,
    dateOfBirth: "",
    userPosts: [],
  },
  weightHistory: [
    {
      date: "",
      weight: 0,
    },
  ],
  bodyFatPercentageHistory: [
    {
      date: "",
      bodyFatPercentage: 0,
    },
  ],
  muscleMassHistory: [
    {
      date: "",
      muscleMass: 0,
    },
  ],
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
    builder.addCase(fetchAsyncListWeightHistory.fulfilled, (state, action) => {
      state.weightHistory = action.payload;
      state.isLoadingProfile = false;
    });
    builder.addCase(
      fetchAsyncListBodyFatPercentageHistory.fulfilled,
      (state, action) => {
        state.bodyFatPercentageHistory = action.payload;
        state.isLoadingProfile = false;
      }
    );
    builder.addCase(
      fetchAsyncListMuscleMassHistory.fulfilled,
      (state, action) => {
        state.muscleMassHistory = action.payload;
        state.isLoadingProfile = false;
      }
    );
    builder.addCase(logout, () => initialState);
  },
});

export const { fetchPostStart, fetchPostEnd, setUserProfileId } =
  profileSlice.actions;

/* ストアから状態を取得してエクスポート*/
export const selectIsLoadingPost = (state: RootState) =>
  state.profile.isLoadingProfile;
export default profileSlice.reducer;
