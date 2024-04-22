import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrltrainingMenus = `${process.env.REACT_APP_DEV_API_URL}api/training_menus/`;

/*トレーニングメニュー取得*/
export const fetchAsyncGetTrainingMenus = createAsyncThunk(
  "training_menu/getUserPosts",
  async () => {
    const res = await axios.get(apiUrltrainingMenus, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
