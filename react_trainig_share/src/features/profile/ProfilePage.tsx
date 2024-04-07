import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Avatar, Grid, Typography } from "@material-ui/core";
import PostCard from "../post/PostCard";
import styles from "./ProfilePage.module.css"; // CSSモジュールのインポート
import Header from "../core/Header"; // Header コンポーネントをインポート

const ProfilePage = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);
  const posts = useSelector(
    (state: RootState) => state.profile.profile.userPosts || []
  );

  return (
    <div>
      <Header /> {/* Header コンポーネントの使用 */}
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
  );
};

export default ProfilePage;
