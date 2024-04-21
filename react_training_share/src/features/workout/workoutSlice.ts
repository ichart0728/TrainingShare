import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { logout } from "../auth/authSlice";
import { v4 as uuidv4 } from "uuid";

//セットの型
interface WorkoutSet {
  id: string;
  //重量
  weight: number;
  //回数
  reps: number;
  //完了したか
  completed: boolean;
}

// トレーニングメニューの型
export interface WorkoutDisplay {
  id: string;
  // トレーニングメニュー
  name: string;
  // 対象部位
  target: string;
  // セット
  sets: WorkoutSet[];
}

// ポップアップで選択したトレーニングメニューの型
export interface selectedWorkout {
  id: number;
  // 対象部位
  target: string;
  // トレーニングメニュー
  name: string;
}

// トレーニングメニュー全体の状態の型
export interface WorkoutState {
  // トレーニングメニュー
  workouts: WorkoutDisplay[];
  // トータルボリューム
  totalVolume: number;
  // 完了済みトータルボリューム
  completedTotalVolume: number;
  // タイマー
  timer: number;
  // タイマーの状態
  isActive: boolean;
  // タイマーが一時停止しているか
  isPaused: boolean;
}

const initialState: WorkoutState = {
  workouts: [],
  totalVolume: 0,
  completedTotalVolume: 0,
  timer: 0,
  isActive: false,
  isPaused: false,
};

export const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    addWorkout: (state, action: PayloadAction<WorkoutDisplay>) => {
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
  incrementTimer,
} = workoutSlice.actions;
export default workoutSlice.reducer;

// export const selectTotalVolume = (state: RootState) =>
//   state.workout.totalVolume;
export const selectTimer = (state: RootState) => state.workout.timer;
