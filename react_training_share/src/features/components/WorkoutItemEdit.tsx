import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Checkbox,
} from "@material-ui/core";
import { RootState } from "../../app/store";
import styles from "./WorkoutItemEdit.module.css";
import { useSelector, useDispatch } from "react-redux";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ConfirmationDialog from "../components/ConfirmationDialog";

import {
  addSet,
  deleteSet,
  updateMemo,
  updateSet,
  removeWorkout,
} from "../workout/workoutSlice";
import { AppDispatch } from "../../app/store";
import { PROPS_WORKOUT_ITEM, Training } from "../types";

const WorkoutItemEdit: React.FC<PROPS_WORKOUT_ITEM> = ({ workout }) => {
  const dispatch: AppDispatch = useDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [completed, setCompleted] = useState(workout.sets.map(() => false));
  const [weights, setWeights] = useState(
    workout.sets.map((set) => set.weight.toString())
  );
  const [reps, setReps] = useState(
    workout.sets.map((set) => set.reps.toString())
  );
  const [memo, setMemo] = useState(workout.memo || "");

  useEffect(() => {
    setWeights(workout.sets.map((set) => set.weight.toString()));
    setReps(workout.sets.map((set) => set.reps.toString()));
  }, [workout.sets]);

  const trainingMenus = useSelector(
    (state: RootState) => state.training.trainingMenus
  );

  const targetName = trainingMenus.find(
    (menu) => menu.id === workout.body_part
  )?.name;

  const menuName = trainingMenus
    .find((menu) => Number(menu.id) === workout.body_part)
    ?.training_menus.find(
      (training_menu: Training) => training_menu.id === Number(workout.menu)
    )?.name;

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleWeightChange = (
    workoutId: string,
    setIndex: number,
    newWeight: string
  ) => {
    const updatedWeights = [...weights];
    updatedWeights[setIndex] = newWeight;
    setWeights(updatedWeights);

    const weightValue = newWeight !== "" ? parseFloat(newWeight) : 0;

    dispatch(
      updateSet({
        workoutId,
        setIndex,
        weight: weightValue,
        reps: parseFloat(reps[setIndex] || "0"),
        completed: completed[setIndex],
      })
    );
  };

  const handleRepsChange = (
    workoutId: string,
    setIndex: number,
    newReps: string
  ) => {
    const updatedReps = [...reps];
    updatedReps[setIndex] = newReps;
    setReps(updatedReps);

    const repsValue = newReps !== "" ? parseInt(newReps, 10) : 0;

    dispatch(
      updateSet({
        workoutId,
        setIndex,
        weight: parseFloat(weights[setIndex] || "0"),
        reps: repsValue,
        completed: completed[setIndex],
      })
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setIndex: number,
    type: "weight" | "reps"
  ) => {
    const inputValue = e.target.value;
    const regex = /^(\d*\.?\d*)?$/;

    if (regex.test(inputValue)) {
      if (type === "weight") {
        handleWeightChange(workout.id, setIndex, inputValue);
      } else if (type === "reps") {
        handleRepsChange(workout.id, setIndex, inputValue);
      }
    }
  };

  const handleMemoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newMemo = e.target.value;
    setMemo(newMemo);
    dispatch(updateMemo({ workoutId: workout.id, memo: newMemo }));
  };

  const handleConfirmDelete = () => {
    dispatch(removeWorkout(workout.id));
    setOpenDeleteModal(false);
  };

  const handleDeleteWorkout = () => {
    setOpenDeleteModal(true);
  };
  const handleAddSet = () => {
    dispatch(addSet({ workoutId: workout.id }));
  };
  const handleDeleteSet = () => {
    if (workout.sets.length === 1) {
      return;
    } else {
      dispatch(deleteSet({ workoutId: workout.id }));
    }
  };

  const totalVolume = workout.sets.reduce(
    (acc, set) => acc + set.weight * set.reps,
    0
  );

  const completedVolume = workout.sets.reduce(
    (acc, set, idx) => (completed[idx] ? acc + set.weight * set.reps : acc),
    0
  );

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
          <DeleteOutlineIcon className={styles.deleteIcon} />
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
      <div className={styles.memoContainer}>
        <TextField
          label="メモ"
          multiline
          minRows={2}
          maxRows={4}
          variant="outlined"
          fullWidth
          value={memo}
          onChange={handleMemoChange}
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
                value={weights[setIndex] || ""}
                onChange={(e) => handleInputChange(e, setIndex, "weight")}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={4} sm={4} className={styles.inputContainer}>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                className={styles.input}
                value={reps[setIndex] || ""}
                onChange={(e) => handleInputChange(e, setIndex, "reps")}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={2} sm={2} className={styles.checkboxContainer}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="medium" />}
                onChange={() => handleToggleCompleted(setIndex)}
                checked={completed[setIndex]}
                checkedIcon={<CheckBoxIcon fontSize="medium" />}
                name="checked"
              />
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
      <ConfirmationDialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="セットの削除"
        content="このアクションは元に戻せません。本当に削除しますか？"
        cancelText="キャンセル"
        confirmText="削除"
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </Paper>
  );
};

export default WorkoutItemEdit;
