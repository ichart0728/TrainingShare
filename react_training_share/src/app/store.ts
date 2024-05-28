// src/store.ts

import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/authSlice";
import postReducer from "../features/post/postSlice";
import profileReducer from "../features/profile/profileSlice";
import workoutReducer from "../features/workout/workoutSlice";
import trainingReducer from "../features/training/trainingSlice";
import workoutHistoryReducer from "../features/workout_history/workoutHistorySlice";
import TimerReducer from "../features/workout/timerSlice";
import {
  PROPS_AUTH_STATE,
  PROPS_POST_STATE,
  PROPS_PROFILE_STATE,
  PROPS_WORKOUT_STATE,
  PROPS_TRAINING_STATE,
  PROPS_WORKOUT_HISTORY_STATE,
  PROPS_TIMER_STATE,
} from "../features/types";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "workout", "profile", "training", "workoutHistory"],
};

const timerPersistConfig = {
  key: "timer",
  storage,
  blacklist: ["elapsedTime"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  profile: profileReducer,
  workout: workoutReducer,
  training: trainingReducer,
  workoutHistory: workoutHistoryReducer,
  timer: persistReducer(timerPersistConfig, TimerReducer),
});

export type RootState = {
  auth: PROPS_AUTH_STATE;
  post: PROPS_POST_STATE;
  profile: PROPS_PROFILE_STATE;
  workout: PROPS_WORKOUT_STATE;
  training: PROPS_TRAINING_STATE;
  workoutHistory: PROPS_WORKOUT_HISTORY_STATE;
  timer: PROPS_TIMER_STATE;
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = typeof store.dispatch;
