import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const trainingMenusUrlProfile = `${process.env.REACT_APP_DEV_API_URL}api/training_menus/`;

/*トレーニングメニュー取得*/
export const fetchAsyncGetTrainingMenus = createAsyncThunk(
  "training_menu/getUserPosts",
  async () => {
    const res = await axios.get(trainingMenusUrlProfile, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
