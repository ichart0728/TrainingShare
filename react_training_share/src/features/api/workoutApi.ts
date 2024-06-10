import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { WORKOUT_POST } from "../types";
import { getAuth } from "firebase/auth";

const apiUrlTrainingSessions = `${process.env.REACT_APP_DEV_API_URL}api/training-sessions/`;
const apiUrlMyTrainingSessions = `${process.env.REACT_APP_DEV_API_URL}api/my-training-sessions/`;
const apiUrlTrainingRecord = `${process.env.REACT_APP_DEV_API_URL}api/training-records/`;

// トレーニングセッションを登録
export const fetchAsyncPostTrainingSessions = createAsyncThunk(
  "workout/PostTrainingSessions",
  async (workout: WORKOUT_POST) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      const res = await axios.post(apiUrlTrainingSessions, workout, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } else {
      throw new Error("User not authenticated");
    }
  }
);

// 自分のトレーニングセッションを取得
export const fetchAsyncGetTrainingSessions = createAsyncThunk(
  "workout/GetMyTrainingSessions",
  async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      const res = await axios.get(apiUrlMyTrainingSessions, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } else {
      throw new Error("User not authenticated");
    }
  }
);

export const fetchAsyncDeleteTrainingRecord = createAsyncThunk(
  "workout/DeleteTrainingRecord",
  async (
    {
      TrainingRecordId,
      TrainingSessionId,
    }: { TrainingRecordId: string; TrainingSessionId: string },
    { rejectWithValue, dispatch }
  ) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      await axios.delete(`${apiUrlTrainingRecord}${TrainingRecordId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // TrainingRecordの削除後、TrainingSessionのworkoutが空になるかチェックする
      const res = await axios.get(
        `${apiUrlTrainingSessions}${TrainingSessionId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const trainingSession = res.data;

      if (trainingSession.workouts.length === 0) {
        // workoutが空の場合、TrainingSessionを削除する
        await dispatch(fetchAsyncDeleteTrainingSession({ TrainingSessionId }));
      }

      return { TrainingRecordId, TrainingSessionId };
    } else {
      throw new Error("User not authenticated");
    }
  }
);

export const fetchAsyncDeleteTrainingSession = createAsyncThunk(
  "workout/DeleteTrainingSession",
  async (
    { TrainingSessionId }: { TrainingSessionId: string },
    { rejectWithValue }
  ) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      const res = await axios.delete(
        `${apiUrlTrainingSessions}${TrainingSessionId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { TrainingSessionId };
    } else {
      throw new Error("User not authenticated");
    }
  }
);
