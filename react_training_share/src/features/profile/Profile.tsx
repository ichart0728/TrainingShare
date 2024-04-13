import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { Avatar, Grid, Typography } from "@material-ui/core";
import PostCard from "../post/PostCard";
import styles from "./Profile.module.css"; // CSSモジュールのインポート
import React, { useEffect, useState } from "react";
import { fetchAsyncGetProf, fetchAsyncGetUserPosts } from "./profileSlice";
import { AppDispatch } from "../../app/store";
import { CircularProgress } from "@material-ui/core";

const Profile = () => {
  const dispatch: AppDispatch = useDispatch();
  const profileId = useSelector((state: RootState) => state.profile.profile.id);
  useEffect(() => {
    if (profileId) {
      dispatch(fetchAsyncGetProf(profileId));
      dispatch(fetchAsyncGetUserPosts(profileId));
    }
  }, [profileId, dispatch]);

  const profile = useSelector((state: RootState) => state.profile.profile);
  const myprofile = useSelector((state: RootState) => state.auth.myprofile);
  const isLoading = useSelector(
    (state: RootState) => state.profile.isLoadingProfile
  );

  const posts = useSelector(
    (state: RootState) => state.profile.userPosts || []
  );
  // フォロー状態のローカルステート（デフォルトは未フォロー）
  const [isFollowing, setIsFollowing] = useState(false);

  // フォロー状態を切り替えるハンドラ
  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };
  if (isLoading) {
    return <CircularProgress />; // ローディングインジケーターを表示
  }
  return (
    <div className={styles.Profile}>
      <div className={styles.profileContent}>
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
                {myprofile.id != profile.id && (
                  <Grid item xs={12} sm={6}>
                    <div className={styles.followButton}>
                      <button onClick={handleFollowClick}>
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  </Grid>
                )}
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

export default Profile;
