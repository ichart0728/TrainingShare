import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { logout } from "../auth/authSlice";
import { v4 as uuidv4 } from "uuid";
import { PROPS_WORKOUT, PROPS_WORKOUT_STATE } from "../types";

const initialState: PROPS_WORKOUT_STATE = {
  workouts: [],
  totalVolume: 0,
  completedTotalVolume: 0,
  timer: {
    active: false,
    paused: true,
    startTime: null,
    time: 0,
  },
};

export const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    addWorkout: (state, action: PayloadAction<PROPS_WORKOUT>) => {
      state.workouts.push(action.payload);
    },
    removeWorkout: (state, action: PayloadAction<string>) => {
      state.workouts = state.workouts.filter(
        (workout) => workout.id !== action.payload
      );
    },
    updateVolume: (state) => {
      state.totalVolume = state.workouts.reduce((total, workout) => {
        return (
          total +
          workout.sets.reduce((setTotal, set) => {
            return setTotal + set.weight * set.reps;
          }, 0)
        );
      }, 0);
    },
    updateSet: (
      state,
      action: PayloadAction<{
        workoutId: string;
        setIndex: number;
        weight: number;
        reps: number;
        completed?: boolean;
      }>
    ) => {
      const workout = state.workouts.find(
        (workout) => workout.id === action.payload.workoutId
      );
      if (workout) {
        const set = workout.sets[action.payload.setIndex];
        if (set) {
          set.weight = action.payload.weight;
          set.reps = action.payload.reps;
          if (action.payload.completed !== undefined) {
            set.completed = action.payload.completed;
          }
        }
      }
    },
    addSet: (state, action: PayloadAction<{ workoutId: string }>) => {
      const { workoutId } = action.payload;
      const workout = state.workouts.find((w) => w.id === workoutId);
      if (workout) {
        workout.sets.push({
          id: uuidv4(),
          weight: 0,
          reps: 0,
          completed: false,
        });
      }
    },
    deleteSet: (state, action: PayloadAction<{ workoutId: string }>) => {
      const { workoutId } = action.payload;
      const workout = state.workouts.find((w) => w.id === workoutId);
      if (workout && workout.sets.length > 0) {
        workout.sets.pop(); // 最後のセットを削除
      }
    },
    clearWorkouts: (state) => {
      state.workouts = [];
    },
    startTimer: (state) => {
      state.timer.active = true;
      state.timer.paused = false;
      state.timer.startTime = new Date().getTime();
    },
    pauseTimer: (state) => {
      state.timer.paused = !state.timer.paused;
    },
    stopTimer: (state) => {
      state.timer.active = false;
      state.timer.paused = true;
      state.timer.startTime = null;
      state.timer.time = 0;
    },
    updateTimerTime: (state) => {
      if (state.timer.active && !state.timer.paused && state.timer.startTime) {
        const currentTime = new Date().getTime();
        state.timer.time = Math.floor(
          (currentTime - state.timer.startTime) / 1000
        );
      }
    },
    incrementTimer: (state) => {
      if (state.timer.active && !state.timer.paused) {
        state.timer.time += 1;
      }
    },
    setTimerTime: (state, action: PayloadAction<number>) => {
      state.timer.time = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  addWorkout,
  removeWorkout,
  updateVolume,
  updateSet,
  addSet,
  deleteSet,
  startTimer,
  pauseTimer,
  stopTimer,
  updateTimerTime,
  incrementTimer,
  setTimerTime,
  clearWorkouts,
} = workoutSlice.actions;
export default workoutSlice.reducer;

export const selectTimer = (state: RootState) => state.workout.timer;
export const selectWorkouts = (state: RootState) => state.workout.workouts;
export const selectTimerActive = (state: RootState) =>
  state.workout.timer.active;
export const selectTimerPaused = (state: RootState) =>
  state.workout.timer.paused;
export const selectTimerTime = (state: RootState) => state.workout.timer.time;
