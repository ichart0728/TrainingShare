import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { checkTokenExpiryAndRefresh } from "./apiUtils";

const apiUrltrainingMenus = `${process.env.REACT_APP_DEV_API_URL}api/training-menus/`;

/*トレーニングメニュー取得*/
export const fetchAsyncGetTrainingMenus = createAsyncThunk(
  "training_menu/getUserPosts",
  async () => {
    const token = await checkTokenExpiryAndRefresh();

    const res = await axios.get(apiUrltrainingMenus, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    return res.data;
  }
);
