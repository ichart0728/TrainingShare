import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { Avatar, Typography } from "@material-ui/core";
import styles from "./Profile.module.css";
import { useEffect } from "react";
import { fetchAsyncGetProf } from "../api/profileApi";
import { fetchAsyncGetUserPosts } from "../api/postApi";
import { AppDispatch } from "../../app/store";
import { CircularProgress } from "@material-ui/core";
import BodyPartChart from "../components/graph/BodyPartChart";

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
  const isLoading = useSelector(
    (state: RootState) => state.profile.isLoadingProfile
  );
  const trainingSessions = useSelector(
    (state: RootState) => state.workoutHistory.trainingSessions
  );
  const trainingMenus = useSelector(
    (state: RootState) => state.training.trainingMenus
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div className={styles.profileContainer}>
      {profile?.nickName && (
        <>
          <div className={styles.profileHeader}>
            <Avatar src={profile.img} className={styles.profileAvatar} />
            <Typography variant="h6">{profile.nickName}</Typography>
          </div>
          <div className={styles.historyContainer}>
            <BodyPartChart
              trainingSessions={trainingSessions}
              trainingMenus={trainingMenus}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
