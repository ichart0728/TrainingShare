// src/workout/timerSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { logout } from "../auth/authSlice";

import { PROPS_TIMER_STATE } from "../types";

const initialState: PROPS_TIMER_STATE = {
  active: false,
  paused: true,
  startTime: 0,
  pausedTime: 0,
  elapsedTime: 0,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startTimer: (state) => {
      state.active = true;
      state.paused = false;
      state.startTime = Date.now();
      state.pausedTime = 0;
    },
    pauseTimer: (state) => {
      if (state.active && !state.paused) {
        state.paused = true;
        state.pausedTime = Date.now();
      }
    },
    resumeTimer: (state) => {
      if (state.active && state.paused) {
        state.paused = false;
        state.startTime = Date.now() - (state.pausedTime - state.startTime);
        state.pausedTime = 0;
      }
    },
    stopTimer: (state) => {
      state.active = false;
      state.paused = true;
      state.startTime = 0;
      state.pausedTime = 0;
      state.elapsedTime = 0;
    },
    setTimerState: (
      state,
      action: PayloadAction<Partial<PROPS_TIMER_STATE>>
    ) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { startTimer, pauseTimer, resumeTimer, stopTimer, setTimerState } =
  timerSlice.actions;

export default timerSlice.reducer;

export const selectTimer = (state: RootState) => state.timer;
export const selectTimerActive = (state: RootState) => state.timer.active;
export const selectTimerPaused = (state: RootState) => state.timer.paused;
export const selectElapsedTime = (state: RootState) => {
  const { active, paused, startTime, pausedTime } = state.timer;
  if (!active) return 0;
  if (paused) return pausedTime - startTime;
  return Date.now() - startTime;
};
