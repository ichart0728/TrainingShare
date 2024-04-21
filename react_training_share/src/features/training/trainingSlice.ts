// src/features/training/trainingSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchAsyncGetTrainingMenus } from "../api/trainingMenuApi";
import { logout } from "../auth/authSlice";

export interface Training {
  id: number;
  name: string;
}
export interface TrainingMenu {
  id: number;
  name: string;
  training_menus: Training[];
}

interface TrainingState {
  trainingMenus: TrainingMenu[];
  isLoading: boolean;
}

const initialState: TrainingState = {
  trainingMenus: [
    {
      id: 0,
      name: "",
      training_menus: [{ id: 0, name: "" }],
    },
  ],
  isLoading: false,
};

export const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetTrainingMenus.fulfilled, (state, action) => {
      state.trainingMenus = action.payload;
    });
    builder.addCase(logout, () => initialState);
  },
});

export const { setLoading } = trainingSlice.actions;

export const selectTrainingMenus = (state: RootState) =>
  state.training.trainingMenus;
export const selectIsLoadingTraining = (state: RootState) =>
  state.training.isLoading;

export default trainingSlice.reducer;
