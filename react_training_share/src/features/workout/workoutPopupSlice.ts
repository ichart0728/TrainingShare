import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Workout {
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
  name: "workoutPopup",
  initialState,
  reducers: {
    setselectedWorkouts: (state, action: PayloadAction<Workout>) => {
      state.selectedWorkouts.push(action.payload);
    },
  },
});

export const { setselectedWorkouts } = workoutPopupSlice.actions;
export default workoutPopupSlice.reducer;
