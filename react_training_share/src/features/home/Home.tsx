import React, { useEffect } from "react";
import Auth from "../auth/Auth";

import styles from "./Home.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

import { Grid } from "@material-ui/core";

import { selectMyProfile } from "../auth/authSlice";

import { selectPosts } from "../post/postSlice";

import Post from "../post/Post";
import EditProfile from "./EditProfile";
import NewPost from "./NewPost";

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  // ログインユーザーのプロフィール情報
  const profile = useSelector(selectMyProfile);
  // 投稿の一覧
  const posts = useSelector(selectPosts);

  return (
    <div className={styles.coreContainer}>
      <div className={styles.coreMainContent}>
        <EditProfile />
        <Auth />
        <NewPost />
        {/* メインコンテンツ */}
        {profile?.nickName && (
          <div className={styles.core_posts}>
            {/* 投稿一覧 */}
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
        )}
      </div>
    </div>
  );
};
export default Core;
