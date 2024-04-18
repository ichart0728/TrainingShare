import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Workout {
  id: number;
  name: string;
}

interface WorkoutState {
  selectedWorkouts: Workout[];
}

const initialState: WorkoutState = {
  selectedWorkouts: [],
};

export const workoutPopupSlice = createSlice({
  name: "selectedWorkouts",
  initialState,
  reducers: {
    setselectedWorkouts: (state, action: PayloadAction<Workout[]>) => {
      state.selectedWorkouts = [...state.selectedWorkouts, ...action.payload];
    },
    clearSelectedWorkouts: (state) => {
      state.selectedWorkouts = [];
    },
  },
});

export const { setselectedWorkouts } = workoutPopupSlice.actions;
export default workoutPopupSlice.reducer;
