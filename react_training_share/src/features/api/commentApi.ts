import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PROPS_COMMENT } from "../types";
import { checkTokenExpiryAndRefresh } from "./apiUtils";
import Cookies from "universal-cookie";

const apiUrlComment = `${process.env.REACT_APP_DEV_API_URL}api/comments/`;
const cookies = new Cookies();

/*コメントの一覧を取得*/
export const fetchAsyncGetComments = createAsyncThunk(
  "comment/get",
  async () => {
    const res = await axios.get(apiUrlComment, {
      headers: {
        Authorization: `JWT ${cookies.get("accesstoken")}`,
      },
      withCredentials: true,
    });
    return res.data;
  }
);

/*コメント新規作成*/
export const fetchAsyncPostComment = createAsyncThunk(
  "comment/post",
  async (comment: PROPS_COMMENT) => {
    const res = await axios.post(apiUrlComment, comment, {
      headers: {
        Authorization: `JWT ${cookies.get("accesstoken")}`,
      },
      withCredentials: true,
    });
    return res.data;
  }
);
