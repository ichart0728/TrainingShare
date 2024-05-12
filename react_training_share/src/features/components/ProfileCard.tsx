import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import {
  Avatar,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
} from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";

import styles from "./ProfileCard.module.css";
import { fetchAsyncUpdateProf } from "../api/profileApi";
import { AppDispatch } from "../../app/store";

const ProfileCard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);

  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(profile);

  const handleInputChange = (
    event: React.ChangeEvent<{ name: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleGenderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const gender = event.target.value as string;
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      gender,
    }));
  };

  const handleSaveProfile = () => {
    dispatch(fetchAsyncUpdateProf(updatedProfile));
    setEditMode(false);
  };

  return (
    <Card className={styles.profileCard}>
      <CardContent className={styles.profileContent}>
        <div className={styles.profileHeader}>
          <Avatar
            src={updatedProfile?.img || ""}
            className={styles.profileAvatar}
          />
          <div className={styles.profileInfo}>
            <div className={styles.profileField}>
              <Grid item xs={5}>
                <Typography variant="subtitle1" className={styles.profileLabel}>
                  名前:
                </Typography>
              </Grid>
              <Grid item xs={7}>
                {editMode ? (
                  <TextField
                    name="nickName"
                    value={updatedProfile?.nickName || ""}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    className={styles.profileInput}
                  />
                ) : (
                  <Typography variant="subtitle1">
                    {updatedProfile?.nickName || ""}
                  </Typography>
                )}
              </Grid>
            </div>
            <div className={styles.profileField}>
              <Grid item xs={5}>
                <Typography variant="subtitle1" className={styles.profileLabel}>
                  性別:
                </Typography>
              </Grid>
              <Grid item xs={7}>
                {editMode ? (
                  <Select
                    name="gender"
                    value={updatedProfile?.gender || ""}
                    onChange={handleGenderChange}
                    variant="outlined"
                    fullWidth
                    className={styles.profileInput}
                  >
                    <MenuItem value="男性">男性</MenuItem>
                    <MenuItem value="女性">女性</MenuItem>
                    <MenuItem value="その他">その他</MenuItem>
                  </Select>
                ) : (
                  <Typography
                    variant="subtitle1"
                    className={styles.profileValue}
                  >
                    {updatedProfile?.gender || "-"}
                  </Typography>
                )}
              </Grid>
            </div>
            <div className={styles.profileField}>
              <Grid item xs={5}>
                <Typography variant="subtitle1" className={styles.profileLabel}>
                  身長:
                </Typography>
              </Grid>
              <Grid item xs={7}>
                {editMode ? (
                  <TextField
                    name="height"
                    type="number"
                    value={updatedProfile?.height || ""}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    className={styles.profileInput}
                    InputProps={{
                      endAdornment: (
                        <Typography variant="subtitle1">cm</Typography>
                      ),
                    }}
                  />
                ) : (
                  <Typography
                    variant="subtitle1"
                    className={styles.profileValue}
                  >
                    {updatedProfile?.height || "-"} cm
                  </Typography>
                )}
              </Grid>
            </div>
            <div className={styles.profileField}>
              <Grid item xs={5}>
                <Typography variant="subtitle1" className={styles.profileLabel}>
                  生年月日:
                </Typography>
              </Grid>
              <Grid item xs={7}>
                {editMode ? (
                  <TextField
                    name="dateOfBirth"
                    type="date"
                    value={updatedProfile?.dateOfBirth || ""}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    className={styles.profileInput}
                  />
                ) : (
                  <Typography
                    variant="subtitle1"
                    className={styles.profileValue}
                  >
                    {updatedProfile?.dateOfBirth || "YYYY-MM-DD"}
                  </Typography>
                )}
              </Grid>
            </div>
          </div>
          {!editMode && (
            <IconButton
              className={styles.editButton}
              onClick={() => setEditMode(true)}
            >
              <EditIcon />
            </IconButton>
          )}
        </div>
      </CardContent>
      {editMode && (
        <CardActions className={styles.actionButtons}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveProfile}
          >
            保存
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default ProfileCard;
