import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import postReducer from "../features/post/postSlice";
import profileReducer from "../features/profile/profileSlice";
import workoutReducer from "../features/workout/workoutSlice";
import trainingReducer from "../features/training/trainingSlice";
import workoutHistoryReducer from "../features/workout_history/workoutHistorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    profile: profileReducer,
    workout: workoutReducer,
    training: trainingReducer,
    workoutHistory: workoutHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = typeof store.dispatch;
