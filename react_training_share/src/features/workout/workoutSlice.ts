import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_NEWPOST, PROPS_LIKED, PROPS_COMMENT } from "../types";

const apiUrlMenu = `${process.env.REACT_APP_DEV_API_URL}api/menu/`;

/*プロフィール情報取得*/
export const fetchAsyncGetTrainingMenu = createAsyncThunk(
  "training_menu/get",
  async (userId: string) => {
    const res = await axios.get(apiUrlMenu, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

// state.SelectedWorkoutを初期化
export const ResetSelectedWorkout = createAsyncThunk(
  "ResetSelectedWorkout",
  async () => {
    return { selectedWorkout: [{ Menu: "" }] };
  }
);

export const workoutSlice = createSlice({
  name: "workout",
  initialState: {
    /*投稿やコメントをfetchしている時のローディング制御*/
    isLoadingMenu: false,
    workout: [
      {
        id: "",
        training_menu: "",
        target: "",
      },
    ],
    userPosts: [],
  },
  reducers: {},
  /*各reducersの後処理を定義*/
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetTrainingMenu.fulfilled, (state, action) => {
      /*取得したトレーニングメニュー情報をセット*/
      state.workout = {
        ...state.workout,
        ...action.payload,
      };
    });
    // builder.addCase(ResetSelectedWorkout.fulfilled, (state, action) => {
    //   /*取得したトレーニングメニュー情報をセット*/
    //   state.selectedWorkout = {
    //     ...state.workout,
    //     ...action.payload,
    //   };
    // });
  },
});

/* ストアから状態を取得してエクスポート*/
export const selectIsLoadingPost = (state: RootState) =>
  state.profile.isLoadingProfile;
export default workoutSlice.reducer;
