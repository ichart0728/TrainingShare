import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { WORKOUT_POST } from "../types";

const apiUrlTrainingSessions = `${process.env.REACT_APP_DEV_API_URL}api/training_sessions/`;
const apiUrlMyTrainingSessions = `${process.env.REACT_APP_DEV_API_URL}api/my_training_sessions/`;

// トレーニングセッションを登録
export const fetchAsyncPostTrainingSessions = createAsyncThunk(
  "workout/PostTrainingSessions",
  async (workout: WORKOUT_POST) => {
    const res = await axios.post(apiUrlTrainingSessions, workout, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

// 自分のトレーニングセッションを取得
export const fetchAsyncGetTrainingSessions = createAsyncThunk(
  "workout/GetMyTrainingSessions",
  async () => {
    const res = await axios.get(apiUrlMyTrainingSessions, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
