import React, { useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { WorkoutDisplay } from "../workout/workoutSlice";
import styles from "./WorkoutItem.module.css";
import { useDispatch } from "react-redux";
import { updateSet } from "../workout/workoutSlice";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

interface WorkoutItemProps {
  workout: WorkoutDisplay;
}

interface SetState {
  weight: number;
  reps: number;
}

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout }) => {
  const dispatch = useDispatch();

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
  return (
    <Paper className={styles.workoutItem} elevation={2}>
      <Typography variant="subtitle1" gutterBottom>
        {workout.target} | {workout.name}
      </Typography>
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
        >
          - セット削除
        </Button>
        <Button variant="outlined" color="primary" className={styles.setButton}>
          + セット追加
        </Button>
      </div>
    </Paper>
  );
};

export default WorkoutItem;
