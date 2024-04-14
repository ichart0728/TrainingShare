import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_NEWPOST, PROPS_LIKED, PROPS_COMMENT } from "../types";

const apiUrlMenu = `${process.env.REACT_APP_DEV_API_URL}api/menu/`;

export const workoutPopupSlice = createSlice({
  name: "workout",
  initialState: {
    isLoadingMenu: false,
    selectedWorkout: [{ Menu: "" }],
  },
  reducers: {
    setSelectedWorkout: (state, action: PayloadAction<string>) => {
      // 既存のselectedWorkoutに新しい選択メニューを追加
      state.selectedWorkout.push({ Menu: action.payload });
    },
    fetchPostStart: (state) => {
      state.isLoadingMenu = true;
    },
    fetchPostEnd: (state) => {
      state.isLoadingMenu = false;
    },
  },
});

export const { setSelectedWorkout } = workoutPopupSlice.actions;

export default workoutPopupSlice.reducer;
