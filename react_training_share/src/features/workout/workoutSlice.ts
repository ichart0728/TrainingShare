// import { createSlice } from "@reduxjs/toolkit";

// interface Workout {
//   id: string;
//   training_menu: string;
//   target: string;
// }

// interface WorkoutState {
//   selectedWorkouts: Workout[];
// }

// const initialState: WorkoutState = {
//   selectedWorkouts: [],
// };

// export const workoutSlice = createSlice({
//   name: "selectedWorkouts",
//   initialState,
//   reducers: {
//     resetselectedWorkouts: (state) => {
//       state.selectedWorkouts = [];
//     },
//   },
// });

// export type { Workout };
// export const { resetselectedWorkouts } = workoutSlice.actions;
// export default workoutSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface Workout {
  id: string;
  name: string;
  sets: Array<{ weight: number; reps: number }>;
}

interface WorkoutState {
  workouts: Workout[];
  totalVolume: number;
  timer: number;
  isActive: boolean;
  isPaused: boolean;
}

const initialState: WorkoutState = {
  workouts: [],
  totalVolume: 0,
  timer: 0,
  isActive: false,
  isPaused: false,
};

export const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    addWorkout: (state, action: PayloadAction<Workout>) => {
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
    startTimer: (state) => {
      state.isActive = true;
      state.isPaused = false;
    },
    pauseTimer: (state) => {
      state.isPaused = !state.isPaused;
    },
    stopTimer: (state) => {
      state.isActive = false;
      state.timer = 0;
    },
    incrementTimer: (state) => {
      if (state.isActive && !state.isPaused) {
        state.timer += 1;
      }
    },
  },
});

export const {
  addWorkout,
  removeWorkout,
  updateVolume,
  startTimer,
  pauseTimer,
  stopTimer,
  incrementTimer,
} = workoutSlice.actions;
export default workoutSlice.reducer;

export const selectWorkouts = (state: RootState) => state.workout.workouts;
export const selectTotalVolume = (state: RootState) =>
  state.workout.totalVolume;
export const selectTimer = (state: RootState) => state.workout.timer;
