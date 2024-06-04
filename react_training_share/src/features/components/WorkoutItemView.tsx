import React, { useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Grid,
  Checkbox,
  Button,
} from "@material-ui/core";
import { RootState } from "../../app/store";
import styles from "./WorkoutItemView.module.css";
import { useSelector, useDispatch } from "react-redux";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { AppDispatch } from "../../app/store";

import { PROPS_TRAINING, PROPS_WORKOUT_ITEM_VIEW } from "../types";
import { fetchAsyncDeleteTrainingRecord } from "../api/workoutApi";

const WorkoutItemView: React.FC<PROPS_WORKOUT_ITEM_VIEW> = ({
  workout,
  trainingSession,
  onDelete,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // store.training.trainingMenuを取得する
  const trainingMenus = useSelector(
    (state: RootState) => state.training.trainingMenus
  );

  // trainingMenuskから対象のトレーニングメニューの対象部位を取得する
  const targetName = trainingMenus.find(
    (menu) => menu.id === workout.body_part
  )?.name;

  // trainingMenuskから対象のトレーニングメニュー名を取得する
  const menuName = trainingMenus
    .find((menu) => Number(menu.id) === workout.body_part)
    ?.training_menus.find(
      (training_menu: PROPS_TRAINING) =>
        training_menu.id === Number(workout.menu)
    )?.name;

  // 完了したセットの総ボリュームを計算
  const completedVolume = workout.sets.reduce(
    (acc, set, idx) =>
      workout.sets[idx].completed ? acc + set.weight * set.reps : acc,
    0
  );

  const handleDeleteWorkout = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    await dispatch(
      fetchAsyncDeleteTrainingRecord({
        TrainingRecordId: workout.id,
        TrainingSessionId: trainingSession.id,
      })
    );
    onDelete(workout.id);
    setOpenDeleteModal(false);
  };

  return (
    <Paper className={styles.workoutItem} elevation={2}>
      <div className={styles.workoutHeader}>
        <Typography
          variant="subtitle1"
          gutterBottom
          className={styles.workoutTitle}
        >
          トレーニング内容
        </Typography>
        <Button onClick={handleDeleteWorkout} className={styles.deleteButton}>
          <DeleteOutlineIcon className={styles.deleteIcon} />
        </Button>
      </div>
      <div className={styles.workoutDetails}>
        <Typography variant="subtitle1" gutterBottom>
          {targetName} | {menuName}
        </Typography>
      </div>
      <div className={styles.volumeDisplay}>
        <Typography variant="subtitle1" gutterBottom>
          総ボリューム: {completedVolume.toFixed(2)}kg
        </Typography>
      </div>
      <div className={styles.memoContainer}>
        <TextField
          label="メモ"
          multiline
          minRows={2}
          maxRows={4}
          variant="outlined"
          fullWidth
          value={workout.memo}
          disabled={true}
        />
      </div>
      <div className={styles.setContent}>
        <Grid container alignItems="center" className={styles.setHeader}>
          <Grid item xs={2} sm={2} className={styles.labelContainer}>
            <Typography align="center">セット</Typography>
          </Grid>
          <Grid item xs={4} sm={4} className={styles.labelContainer}>
            <Typography align="center">kg</Typography>
          </Grid>
          <Grid item xs={4} sm={4} className={styles.labelContainer}>
            <Typography align="center">回</Typography>
          </Grid>
          <Grid item xs={2} sm={2} className={styles.labelContainer}>
            <Typography align="center">完了</Typography>
          </Grid>
        </Grid>
        {workout.sets.map((set, setIndex) => (
          <Grid
            container
            key={setIndex}
            alignItems="center"
            className={styles.setRow}
          >
            <Grid item xs={2} sm={2}>
              <Typography align="center">{setIndex + 1}</Typography>
            </Grid>
            <Grid item xs={4} sm={4} className={styles.inputContainer}>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                className={styles.input}
                value={set.weight}
                disabled={true}
                InputProps={{ inputProps: { min: 0, step: "0.05" } }}
              />
            </Grid>
            <Grid item xs={4} sm={4} className={styles.inputContainer}>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                className={styles.input}
                value={set.reps}
                disabled={true}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={2} sm={2} className={styles.checkboxContainer}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="medium" />}
                checked={workout.sets[setIndex].completed}
                checkedIcon={<CheckBoxIcon fontSize="medium" />}
                name="checked"
                disabled={true}
              />{" "}
            </Grid>
          </Grid>
        ))}
      </div>
      <ConfirmationDialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="トレーニングの削除"
        content="このアクションは元に戻せません。本当に削除しますか？"
        cancelText="キャンセル"
        confirmText="削除"
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </Paper>
  );
};

export default WorkoutItemView;
