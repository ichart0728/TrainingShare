import React, { useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Checkbox,
} from "@material-ui/core";
import { RootState } from "../../app/store";
import { PROPS_WORKOUT_DISPLAY } from "../workout/workoutSlice";
import styles from "./WorkoutItem.module.css";
import { useSelector, useDispatch } from "react-redux";
import { updateSet } from "../workout/workoutSlice";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { addSet, deleteSet, removeWorkout } from "../workout/workoutSlice";
import { AppDispatch } from "../../app/store";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { PROPS_WORKOUT_ITEM } from "../types";

const WorkoutItem: React.FC<PROPS_WORKOUT_ITEM> = ({ workout }) => {
  const dispatch: AppDispatch = useDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [completed, setCompleted] = useState(workout.sets.map(() => false));
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
    .find((menu) => menu.id === workout.body_part)
    ?.training_menus.find(
      (training_menu: any) => training_menu.id === workout.menu
    )?.name;

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const handleWeightChange = (
    workoutId: string,
    setIndex: number,
    newWeight: number,
    reps: number,
    completed: boolean
  ) => {
    dispatch(
      updateSet({
        workoutId,
        setIndex,
        weight: newWeight,
        reps,
        completed,
      })
    );
  };
  const handleConfirmDelete = () => {
    dispatch(removeWorkout(workout.id)); // 対象のトレーニングメニューを削除するアクションをディスパッチ
    setOpenDeleteModal(false); // モーダルを閉じる
  };

  const handleRepsChange = (
    workoutId: string,
    setIndex: number,
    weight: number,
    newReps: number
  ) => {
    dispatch(
      updateSet({
        workoutId,
        setIndex,
        weight,
        reps: newReps,
        completed: completed[setIndex],
      })
    );
  };
  const handleDeleteWorkout = () => {
    setOpenDeleteModal(true);
  };
  const handleAddSet = () => {
    dispatch(addSet({ workoutId: workout.id }));
  };
  const handleDeleteSet = () => {
    dispatch(deleteSet({ workoutId: workout.id }));
  };

  // トレーニングボリュームを計算
  const totalVolume = workout.sets.reduce(
    (acc, set) => acc + set.weight * set.reps,
    0
  );

  // 完了したセットの総ボリュームを計算
  const completedVolume = workout.sets.reduce(
    (acc, set, idx) => (completed[idx] ? acc + set.weight * set.reps : acc),
    0
  );

  // 完了状態の切り替え
  const handleToggleCompleted = (setIndex: number) => {
    const updatedCompleted = [...completed];
    updatedCompleted[setIndex] = !updatedCompleted[setIndex];

    setCompleted(updatedCompleted);

    dispatch(
      updateSet({
        workoutId: workout.id,
        setIndex,
        weight: workout.sets[setIndex].weight,
        reps: workout.sets[setIndex].reps,
        completed: updatedCompleted[setIndex],
      })
    );
  };
  return (
    <Paper className={styles.workoutItem} elevation={2}>
      <div className={styles.workoutHeader}>
        <Typography
          variant="subtitle1"
          gutterBottom
          className={styles.workoutTitle}
        >
          {targetName} | {menuName}
        </Typography>
        <Button onClick={handleDeleteWorkout} className={styles.deleteButton}>
          <DeleteOutlineIcon />
        </Button>
      </div>
      <div className={styles.volumeDisplay}>
        <Typography variant="subtitle1" gutterBottom>
          総ボリューム: {completedVolume.toFixed(2)}/{totalVolume.toFixed(2)}kg
          (
          {totalVolume > 0
            ? ((completedVolume / totalVolume) * 100).toFixed(1)
            : "0"}
          %)
        </Typography>
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
                onChange={(e) =>
                  handleWeightChange(
                    workout.id,
                    setIndex, // 正しいインデックスを使用
                    Number(e.target.value),
                    set.reps,
                    completed[setIndex]
                  )
                }
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
                onChange={(e) => {
                  handleRepsChange(
                    workout.id,
                    setIndex, // 正しいインデックスを使用
                    set.weight,
                    Number(e.target.value)
                  );
                }}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={2} sm={2} className={styles.checkboxContainer}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="medium" />}
                onChange={() => handleToggleCompleted(setIndex)} // 正しいインデックスを使用
                checked={completed[setIndex]}
                checkedIcon={<CheckBoxIcon fontSize="medium" />}
                name="checked"
              />{" "}
            </Grid>
          </Grid>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="outlined"
          color="secondary"
          className={styles.setButton}
          onClick={handleDeleteSet}
        >
          - セット削除
        </Button>
        <Button
          variant="outlined"
          color="primary"
          className={styles.setButton}
          onClick={handleAddSet}
        >
          + セット追加
        </Button>
      </div>
      <Dialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"削除しますか？"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            このアクションは元に戻せません。本当に削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default WorkoutItem;
