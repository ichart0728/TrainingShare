import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Avatar, Grid, Typography } from "@material-ui/core";
import PostCard from "../post/PostCard";
import styles from "./ProfilePage.module.css"; // CSSモジュールのインポート
import Sidebar from "../core/Sidebar";
import React, { useState } from "react";

const ProfilePage = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);
  const posts = useSelector(
    (state: RootState) => state.profile.userPosts || []
  );
  // フォロー状態のローカルステート（デフォルトは未フォロー）
  const [isFollowing, setIsFollowing] = useState(false);

  // フォロー状態を切り替えるハンドラ
  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className={styles.profilePage}>
      {profile?.nickName && (
        <div className={styles.profileSidebar}>
          <Sidebar />
        </div>
      )}{" "}
      <div className={styles.profileContent}>
        {" "}
        {/* メインコンテンツのラッパー */}
        {profile?.nickName && (
          <>
            {/* https://v4.mui.com/fr/customization/breakpoints/ */}
            <div className={styles.profileContainer}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Avatar src={profile.img} className={styles.profileAvatar} />
                  <div className={styles.profileInfo}>
                    <Typography variant="h6">{profile.nickName}</Typography>
                    <Typography
                      variant="body1"
                      className={styles.typographyCustom}
                    >
                      フォロー数: 10
                    </Typography>
                    <Typography
                      variant="body1"
                      className={styles.typographyCustom}
                    >
                      フォロワー数: 10
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className={styles.followButton}>
                    <button onClick={handleFollowClick}>
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                </Grid>
                <Grid item xs={12} className={styles.postsContainer}>
                  <Typography variant="h6" align="center">
                    投稿一覧
                  </Typography>
                  {posts.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </Grid>
              </Grid>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
