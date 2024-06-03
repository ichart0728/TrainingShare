import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { checkTokenExpiryAndRefresh } from "./apiUtils";
import Cookies from "universal-cookie";

const apiUrltrainingMenus = `${process.env.REACT_APP_DEV_API_URL}api/training-menus/`;
const cookies = new Cookies();

/*トレーニングメニュー取得*/
export const fetchAsyncGetTrainingMenus = createAsyncThunk(
  "training_menu/getUserPosts",
  async () => {
    const res = await axios.get(apiUrltrainingMenus, {
      headers: {
        Authorization: `JWT ${cookies.get("accesstoken")}`,
      },
      withCredentials: true,
    });
    return res.data;
  }
);
