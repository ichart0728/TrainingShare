import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchAsyncGetTrainingSessions } from "../api/workoutApi";
import { PROPS_WORKOUT_HISTORY_STATE, PROPS_TRAINING_SESSION } from "../types";

const initialState: PROPS_WORKOUT_HISTORY_STATE = {
  trainingSessions: [],
  loading: false,
  error: null,
};

export const workoutHistorySlice = createSlice({
  name: "workoutHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncGetTrainingSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAsyncGetTrainingSessions.fulfilled,
        (state, action: PayloadAction<PROPS_TRAINING_SESSION[]>) => {
          state.loading = false;
          state.trainingSessions = action.payload;
        }
      )
      .addCase(fetchAsyncGetTrainingSessions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Failed to fetch training sessions";
      });
  },
});

export const selectTrainingSessions = (state: RootState) =>
  state.workoutHistory.trainingSessions;
export const selectLoading = (state: RootState) => state.workoutHistory.loading;
export const selectError = (state: RootState) => state.workoutHistory.error;

export default workoutHistorySlice.reducer;
