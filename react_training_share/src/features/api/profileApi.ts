import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = `${process.env.REACT_APP_DEV_API_URL}api/`;

export const fetchAsyncGetProf = createAsyncThunk("profile/get", async () => {
  const res = await axios.get(`${apiUrl}profiles/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data[0];
});

export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/update",
  async (updatedProfile: any) => {
    const res = await axios.put(
      `${apiUrl}profiles/${updatedProfile.id}/`,
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
  async (data: { weight: number; date: string }) => {
    const res = await axios.post(`${apiUrl}weight-history/`, data, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const fetchAsyncAddBodyFatPercentageHistory = createAsyncThunk(
  "profile/addBodyFatPercentage",
  async (data: { bodyFatPercentage: number; date: string }) => {
    const res = await axios.post(
      `${apiUrl}body-fat-percentage-history/`,
      data,
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

export const fetchAsyncAddMuscleMassHistory = createAsyncThunk(
  "profile/addMuscleMass",
  async (data: { muscleMass: number; date: string }) => {
    const res = await axios.post(`${apiUrl}muscle-mass-history/`, data, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const fetchAsyncListWeightHistory = createAsyncThunk(
  "profile/listWeight",
  async () => {
    const res = await axios.get(`${apiUrl}weight-history/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const fetchAsyncListBodyFatPercentageHistory = createAsyncThunk(
  "profile/listBodyFatPercentage",
  async () => {
    const res = await axios.get(`${apiUrl}body-fat-percentage-history/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const fetchAsyncListMuscleMassHistory = createAsyncThunk(
  "profile/listMuscleMass",
  async () => {
    const res = await axios.get(`${apiUrl}muscle-mass-history/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
