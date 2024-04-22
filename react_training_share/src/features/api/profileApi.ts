import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrlProfile = `${process.env.REACT_APP_DEV_API_URL}api/profiles/`;

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
