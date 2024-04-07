import React, { useEffect } from "react";
import Auth from "../auth/Auth";

import styles from "./Core.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

import { Grid } from "@material-ui/core";

import {
  selectProfile,
  setOpenSignIn,
  resetOpenSignIn,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "../auth/authSlice";

import {
  selectPosts,
  fetchAsyncGetPosts,
  fetchAsyncGetComments,
} from "../post/postSlice";

import Post from "../post/Post";
import EditProfile from "./EditProfile";
import NewPost from "./NewPost";
import Header from "./Header"; // Header コンポーネントをインポート
// 不要になったimport文は削除

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  // ログインユーザーのプロフィール情報
  const profile = useSelector(selectProfile);
  // 投稿の一覧
  const posts = useSelector(selectPosts);

  // ブラウザが起動したときに最初に実行される処理
  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        // JWTトークンがある場合は、サインインモーダルを閉じる
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          // JWTトークンの有効期限が切れている場合はサインインモーダルを表示して終了
          dispatch(setOpenSignIn());
          return null;
        }
        await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchAsyncGetProfs());
        await dispatch(fetchAsyncGetComments());
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <div>
      <Auth />
      <EditProfile />
      <NewPost />
      <Auth />
      <Header /> {/* Header コンポーネントの使用 */}
      {profile?.nickName && (
        <>
          {/* https://v4.mui.com/fr/customization/breakpoints/ */}
          <div className={styles.core_posts}>
            {/*最新の投稿を左上に表示させたいのでreverse*/}
            <Grid container spacing={4}>
              {posts
                .slice(0)
                .reverse()
                .map((post) => (
                  <Grid key={post.id} item xs={12} md={4}>
                    <Post
                      postId={post.id}
                      title={post.title}
                      loginId={profile.userProfile}
                      userPost={post.userPost}
                      imageUrl={post.img}
                      liked={post.liked}
                    />
                  </Grid>
                ))}
            </Grid>
          </div>
        </>
      )}
    </div>
  );
};

export default Core;
