import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchAsyncGetTrainingSessions } from "../api/workoutApi";

interface TrainingSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

interface TrainingRecord {
  id: string;
  menu: string;
  body_part: string;
  sets: TrainingSet[];
}

interface TrainingSession {
  id: string;
  date: string;
  duration: number;
  workouts: TrainingRecord[];
}

interface WorkoutHistoryState {
  trainingSessions: TrainingSession[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkoutHistoryState = {
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
        (state, action: PayloadAction<TrainingSession[]>) => {
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
