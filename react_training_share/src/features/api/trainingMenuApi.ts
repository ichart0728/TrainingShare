import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const bodyPartUrlPost = `${process.env.REACT_APP_DEV_API_URL}api/body_part/`;
const trainingMenuUrlProfile = `${process.env.REACT_APP_DEV_API_URL}api/training_menu/`;

/*部位取得*/
export const fetchAsyncGetBodyPart = createAsyncThunk(
  "body_part/get",
  async () => {
    const res = await axios.get(bodyPartUrlPost, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

/*トレーニングメニュー取得*/
export const fetchAsyncGetTrainingMenu = createAsyncThunk(
  "training_menu/getUserPosts",
  async () => {
    const res = await axios.get(trainingMenuUrlProfile, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
