import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import {
  fetchAsyncGetPosts,
  fetchAsyncNewPost,
  fetchAsyncPatchLiked,
} from "../api/postApi";

import {
  fetchAsyncGetComments,
  fetchAsyncPostComment,
} from "../api/commentApi";

import { logout } from "../auth/authSlice";
import { PROPS_POST_STATE } from "../types";

const initialState: PROPS_POST_STATE = {
  /*投稿やコメントをfetchしている時のローディング制御*/
  isLoadingPost: false,
  /*新規投稿用モーダルの制御*/
  openNewPost: false,
  posts: [
    {
      id: "",
      title: "",
      userPost: "",
      created_on: "",
      img: "",
      liked: [""],
    },
  ],
  comments: [
    {
      id: "",
      text: "",
      userComment: "",
      post: "",
    },
  ],
  profile: {
    id: "",
    nickName: "",
    userProfile: "",
    created_on: "",
    img: "",
    userPosts: [],
  },
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    /*ローディグ管理の制御*/
    fetchPostStart(state) {
      state.isLoadingPost = true;
    },
    fetchPostEnd(state) {
      state.isLoadingPost = false;
    },
    /*新規投稿用モーダルの制御*/
    setOpenNewPost(state) {
      state.openNewPost = true;
    },
    resetOpenNewPost(state) {
      state.openNewPost = false;
    },
  },
  /*各reducersの後処理を定義*/
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetPosts.fulfilled, (state, action) => {
      /*取得した投稿をセット*/
      return {
        ...state,
        posts: action.payload,
      };
    });
    builder.addCase(fetchAsyncNewPost.fulfilled, (state, action) => {
      /*新規で作成した投稿を投稿用の配列に追加*/
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    });
    builder.addCase(fetchAsyncGetComments.fulfilled, (state, action) => {
      /*取得したコメントをセット*/
      return {
        ...state,
        comments: action.payload,
      };
    });
    builder.addCase(fetchAsyncPostComment.fulfilled, (state, action) => {
      /*新規で作成したコメントをコメント用の配列に追加*/
      return {
        ...state,
        comments: [...state.comments, action.payload],
      };
    });
    builder.addCase(fetchAsyncPatchLiked.fulfilled, (state, action) => {
      /*更新した投稿で置き換える*/
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };
    });
    builder.addCase(logout, () => initialState);
  },
});

export const {
  fetchPostStart,
  fetchPostEnd,
  setOpenNewPost,
  resetOpenNewPost,
} = postSlice.actions;

/* ストアから状態を取得してエクスポート*/
export const selectIsLoadingPost = (state: RootState) =>
  state.post.isLoadingPost;
export const selectOpenNewPost = (state: RootState) => state.post.openNewPost;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectComments = (state: RootState) => state.post.comments;

export default postSlice.reducer;
