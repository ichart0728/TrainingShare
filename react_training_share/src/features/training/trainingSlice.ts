// src/features/training/trainingSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  fetchAsyncGetBodyPart,
  fetchAsyncGetTrainingMenu,
} from "../api/trainingMenuApi";

interface TrainingState {
  bodyParts: any[];
  trainingMenus: any[];
  isLoading: boolean;
}

const initialState: TrainingState = {
  bodyParts: [],
  trainingMenus: [],
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
    builder
      .addCase(fetchAsyncGetBodyPart.fulfilled, (state, action) => {
        state.bodyParts = action.payload;
      })
      .addCase(fetchAsyncGetTrainingMenu.fulfilled, (state, action) => {
        state.trainingMenus = action.payload;
      });
  },
});

export const { setLoading } = trainingSlice.actions;

export const selectBodyParts = (state: RootState) => state.training.bodyParts;
export const selectTrainingMenus = (state: RootState) =>
  state.training.trainingMenus;
export const selectIsLoadingTraining = (state: RootState) =>
  state.training.isLoading;

export default trainingSlice.reducer;
