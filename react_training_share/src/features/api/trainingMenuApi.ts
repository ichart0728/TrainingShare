import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuth } from "firebase/auth";

const apiUrltrainingMenus = `${process.env.REACT_APP_DEV_API_URL}api/training-menus/`;

/*トレーニングメニュー取得*/
export const fetchAsyncGetTrainingMenus = createAsyncThunk(
  "training_menu/getUserPosts",
  async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      const res = await axios.get(apiUrltrainingMenus, {
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
