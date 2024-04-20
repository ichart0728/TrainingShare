import React, { useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Checkbox,
} from "@material-ui/core";
import { WorkoutDisplay } from "../workout/workoutSlice";
import styles from "./WorkoutItem.module.css";
import { useDispatch } from "react-redux";
import { updateSet } from "../workout/workoutSlice";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { addSet, deleteSet } from "../workout/workoutSlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

interface WorkoutItemProps {
  workout: WorkoutDisplay;
  index: number;
}

interface SetState {
  id: string;
  weight: number;
  reps: number;
}

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout, index }) => {
  const dispatch = useDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const handleWeightChange = (
    workoutId: string,
    setIndex: number,
    newWeight: number,
    reps: number
  ) => {
    dispatch(
      updateSet({
        workoutId,
        setIndex,
        weight: newWeight,
        reps,
      })
    );
  };
  const handleConfirmDelete = () => {
    // 削除の確認がクリックされた時の処理をここに追加
    // 例えば削除処理の実行や、状態の更新
    setOpenDeleteModal(false);
    // dispatch(deleteWorkout({ workoutId: workout.id })); // 仮の削除アクション
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

  return (
    <Paper className={styles.workoutItem} elevation={2}>
      <div className={styles.workoutHeader}>
        <Typography variant="subtitle1" gutterBottom>
          {workout.target} | {workout.name}
        </Typography>
        <Button onClick={handleDeleteWorkout} className={styles.deleteButton}>
          <DeleteOutlineIcon />
        </Button>
      </div>
      <Grid container alignItems="center">
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
      {workout.sets.map((set, index) => (
        <Grid
          container
          key={index}
          alignItems="center"
          className={styles.setRow}
        >
          <Grid item xs={2} sm={2}>
            <Typography align="center">{index + 1}</Typography>
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
                  index,
                  Number(e.target.value),
                  set.reps
                )
              }
              InputProps={{ inputProps: { min: 0 } }}
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
                  index,
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
              checkedIcon={<CheckBoxIcon fontSize="medium" />}
              name="checked"
            />{" "}
          </Grid>
        </Grid>
      ))}
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
