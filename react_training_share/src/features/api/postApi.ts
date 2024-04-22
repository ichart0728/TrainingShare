import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PROPS_NEWPOST, PROPS_LIKED, PROPS_COMMENT } from "../types";

const apiUrlPost = `${process.env.REACT_APP_DEV_API_URL}api/posts/`;
const apiUrlComment = `${process.env.REACT_APP_DEV_API_URL}api/comments/`;

/*投稿の取得*/
export const fetchAsyncGetPosts = createAsyncThunk("post/get", async () => {
  const res = await axios.get(apiUrlPost, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

/*新規投稿作成*/
export const fetchAsyncNewPost = createAsyncThunk(
  "post/post",
  async (newPost: PROPS_NEWPOST) => {
    const uploadData = new FormData();
    uploadData.append("title", newPost.title);
    newPost.img && uploadData.append("img", newPost.img, newPost.img.name);
    const res = await axios.post(apiUrlPost, uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

/*投稿のいいねを更新*/
export const fetchAsyncPatchLiked = createAsyncThunk(
  "post/patch",
  async (liked: PROPS_LIKED) => {
    const currentLiked = liked.current;
    const uploadData = new FormData();

    /*いいねの取り消しを制御する*/
    let isOverlapped = false;
    currentLiked.forEach((current) => {
      if (current === liked.new) {
        isOverlapped = true;
      } else {
        uploadData.append("liked", String(current));
      }
    });

    /*未いいねの場合は追加*/
    if (!isOverlapped) {
      uploadData.append("liked", String(liked.new));
    } else if (currentLiked.length === 1) {
      /*いいねが0件になる場合はpatchで更新できないので特別にputで空の配列で更新する*/
      uploadData.append("title", liked.title);
      const res = await axios.put(`${apiUrlPost}${liked.id}/`, uploadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return res.data;
    }
    /*自分のいいねを解除した状態で更新*/
    const res = await axios.patch(`${apiUrlPost}${liked.id}/`, uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

/*指定したユーザーの投稿一覧取得*/
export const fetchAsyncGetUserPosts = createAsyncThunk(
  "profile/getUserPosts",
  async (userId: string) => {
    const res = await axios.get(`${apiUrlPost}${userId}/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
