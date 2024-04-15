import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import {
  Avatar,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import PostCard from "../post/PostCard";
import styles from "./Profile.module.css";
import React, { useEffect, useState } from "react";
import { fetchAsyncGetProf, fetchAsyncGetUserPosts } from "./profileSlice";
import { AppDispatch } from "../../app/store";
import { CircularProgress } from "@material-ui/core";

const Profile = () => {
  const dispatch: AppDispatch = useDispatch();
  const profileId = useSelector((state: RootState) => state.profile.profile.id);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div className={styles.profileContainer}>
      {profile?.nickName && (
        <>
          <div className={styles.profileHeader}>
            <Avatar src={profile.img} className={styles.profileAvatar} />
            <div className={styles.profileInfo}>
              <Typography variant="h6">{profile.nickName}</Typography>
              <Typography variant="body1" className={styles.followCount}>
                フォロー数: 10
              </Typography>
              <Typography variant="body1" className={styles.followerCount}>
                フォロワー数: 10
              </Typography>
              {myprofile.id !== profile.id && (
                <div className={styles.followButton}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFollowClick}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.postsContainer}>
            <Grid container spacing={2}>
              {posts.map((post: any) => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <PostCard post={post} />
                </Grid>
              ))}
            </Grid>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
