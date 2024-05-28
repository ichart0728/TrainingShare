// src/workout/timerSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

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
        state.elapsedTime = state.pausedTime - state.startTime;
      }
    },
    resumeTimer: (state) => {
      if (state.active && state.paused) {
        state.paused = false;
        state.startTime = Date.now() - state.elapsedTime;
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
    updateElapsedTime: (state) => {
      if (state.active && !state.paused) {
        state.elapsedTime = Date.now() - state.startTime;
      }
    },
    setTimerState: (
      state,
      action: PayloadAction<Partial<PROPS_TIMER_STATE>>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  updateElapsedTime,
  setTimerState,
} = timerSlice.actions;

export default timerSlice.reducer;

export const selectTimer = (state: RootState) => state.timer;
export const selectTimerActive = (state: RootState) => state.timer.active;
export const selectTimerPaused = (state: RootState) => state.timer.paused;
export const selectElapsedTime = (state: RootState) => state.timer.elapsedTime;
