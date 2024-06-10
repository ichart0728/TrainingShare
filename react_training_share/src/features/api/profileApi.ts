import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuth } from "firebase/auth";

const apiUrl = `${process.env.REACT_APP_DEV_API_URL}api/`;

export const fetchAsyncGetProf = createAsyncThunk("profile/get", async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();

    const res = await axios.get(`${apiUrl}profiles/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return res.data[0];
  } else {
    throw new Error("User not authenticated");
  }
});

export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/update",
  async (updatedProfile: any) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      const res = await axios.put(
        `${apiUrl}profiles/${updatedProfile.id}/`,
        updatedProfile,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } else {
      throw new Error("User not authenticated");
    }
  }
);

export const fetchAsyncAddWeightHistory = createAsyncThunk(
  "profile/addWeight",
  async (data: { weight: number; date: string }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      const res = await axios.post(`${apiUrl}weight-history/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return res.data;
    } else {
      throw new Error("User not authenticated");
    }
  }
);

export const fetchAsyncAddBodyFatPercentageHistory = createAsyncThunk(
  "profile/addBodyFatPercentage",
  async (data: { bodyFatPercentage: number; date: string }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      const res = await axios.post(
        `${apiUrl}body-fat-percentage-history/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } else {
      throw new Error("User not authenticated");
    }
  }
);

export const fetchAsyncAddMuscleMassHistory = createAsyncThunk(
  "profile/addMuscleMass",
  async (data: { muscleMass: number; date: string }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      const res = await axios.post(`${apiUrl}muscle-mass-history/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return res.data;
    } else {
      throw new Error("User not authenticated");
    }
  }
);

export const fetchAsyncListWeightHistory = createAsyncThunk(
  "profile/listWeight",
  async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      const res = await axios.get(`${apiUrl}weight-history/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return res.data;
    } else {
      throw new Error("User not authenticated");
    }
  }
);

export const fetchAsyncListBodyFatPercentageHistory = createAsyncThunk(
  "profile/listBodyFatPercentage",
  async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      const res = await axios.get(`${apiUrl}body-fat-percentage-history/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return res.data;
    } else {
      throw new Error("User not authenticated");
    }
  }
);

export const fetchAsyncListMuscleMassHistory = createAsyncThunk(
  "profile/listMuscleMass",
  async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      const res = await axios.get(`${apiUrl}muscle-mass-history/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return res.data;
    } else {
      throw new Error("User not authenticated");
    }
  }
);
