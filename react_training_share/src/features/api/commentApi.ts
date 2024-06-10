import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PROPS_COMMENT } from "../types";
import { getAuth } from "firebase/auth";

const apiUrlComment = `${process.env.REACT_APP_DEV_API_URL}api/comments/`;

/*コメントの一覧を取得*/
export const fetchAsyncGetComments = createAsyncThunk(
  "comment/get",
  async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      const res = await axios.get(apiUrlComment, {
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

/*コメント新規作成*/
export const fetchAsyncPostComment = createAsyncThunk(
  "comment/post",
  async (comment: PROPS_COMMENT) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      const res = await axios.post(apiUrlComment, comment, {
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
