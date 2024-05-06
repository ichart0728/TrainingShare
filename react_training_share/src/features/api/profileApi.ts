import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrlProfile = `${process.env.REACT_APP_DEV_API_URL}api/profiles/`;

/*プロフィール取得*/
export const fetchAsyncGetMyProf = createAsyncThunk(
  "profile/getMyProfile",
  async () => {
    const res = await axios.get(`${apiUrlProfile}`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data[0];
  }
);

/*プロフィール情報取得*/
export const fetchAsyncGetProf = createAsyncThunk(
  "profile/get",
  async (userId: string) => {
    const res = await axios.get(`${apiUrlProfile}${userId}/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    /*API側からリスト形式で返ってくるので配列の0番目を取得する*/
    return res.data[0];
  }
);

/*プロフィール情報更新*/
export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/update",
  async (updatedProfile: any) => {
    const res = await axios.put(
      `${apiUrlProfile}${updatedProfile.id}/`,
      updatedProfile,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncAddWeightHistory = createAsyncThunk(
  "profile/addWeight",
  async (data: { weight: number; date: string }, { rejectWithValue }) => {
    const response = await axios.post(
      `${apiUrlProfile}weightHistory/create/`,
      data,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
);

export const fetchAsyncAddBodyFatPercentageHistory = createAsyncThunk(
  "profile/addBodyFatPercentage",
  async (
    data: { bodyFatPercentage: number; date: string },
    { rejectWithValue }
  ) => {
    const response = await axios.post(
      `${apiUrlProfile}bodyFatPercentageHistory/create/`,
      data,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
);

export const fetchAsyncAddMuscleMassHistory = createAsyncThunk(
  "profile/addMuscleMass",
  async (data: { muscleMass: number; date: string }, { rejectWithValue }) => {
    const response = await axios.post(
      `${apiUrlProfile}muscleMassHistory/create/`,
      data,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
);

export const fetchAsyncListWeightHistory = createAsyncThunk(
  "profile/ListWeight",
  async () => {
    const res = await axios.get(`${apiUrlProfile}weightHistory/list/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const fetchAsyncListBodyFatPercentageHistory = createAsyncThunk(
  "profile/ListBodyFatPercentage",
  async () => {
    const res = await axios.get(
      `${apiUrlProfile}bodyFatPercentageHistory/list/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncListMuscleMassHistory = createAsyncThunk(
  "profile/ListMuscleMass",
  async () => {
    const res = await axios.get(`${apiUrlProfile}muscleMassHistory/list/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
