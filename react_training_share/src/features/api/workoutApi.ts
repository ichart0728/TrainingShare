import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { WORKOUT_POST } from "../types";

const trainingSessionsUrlProfile = `${process.env.REACT_APP_DEV_API_URL}api/training_sessions/`;

export const fetchAsyncPostTrainingSessions = createAsyncThunk(
  "workout/PostTrainingSessions",
  async (workout: WORKOUT_POST) => {
    const res = await axios.post(trainingSessionsUrlProfile, workout, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
