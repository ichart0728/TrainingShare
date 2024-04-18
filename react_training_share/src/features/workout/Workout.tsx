import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectWorkouts,
  selectTotalVolume,
  startTimer,
  stopTimer,
  pauseTimer,
} from "./workoutSlice";
import styles from "./Workout.module.css";
import WorkoutPopup from "./WorkoutPopup";
import { Modal, Button, Typography } from "@material-ui/core";

const Workout = () => {
  const dispatch = useDispatch();
  const workouts = useSelector(selectWorkouts);
  const totalVolume = useSelector(selectTotalVolume);
  const [openModal, setOpenModal] = useState(false);
  const [trainingActive, setTrainingActive] = useState(false);
  const [paused, setPaused] = useState(true);

  const handleStartOrEnd = () => {
    if (trainingActive) {
      dispatch(stopTimer());
      setTrainingActive(false);
      setPaused(true);
    } else {
      dispatch(startTimer());
      setTrainingActive(true);
      setPaused(false);
    }
  };

  const togglePause = () => {
    if (paused) {
    } else {
      dispatch(pauseTimer());
    }
    setPaused(!paused);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h4" gutterBottom>
          Workout Tracker
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Total Training Volume: {totalVolume}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Training Menu
        </Button>
        <Modal open={openModal} onClose={handleCloseModal}>
          <WorkoutPopup open={openModal} onClose={handleCloseModal} />
        </Modal>
        <div className={styles.workoutList}>
          {workouts.map((workout) => (
            <div key={workout.id} className={styles.workoutItem}>
              <Typography variant="h6">{workout.name}</Typography>
              {workout.sets.map((set, index) => (
                <Typography key={index} variant="body1">
                  Weight: {set.weight}, Reps: {set.reps}
                </Typography>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bottomControls}>
        <Button
          className={styles.fixedWidthButton}
          variant="contained"
          color="primary"
          onClick={handleStartOrEnd}
        >
          {trainingActive ? "End Training" : "Start Training"}
        </Button>
        <Button
          className={styles.fixedWidthButton}
          variant="contained"
          color="primary"
          onClick={togglePause}
          disabled={!trainingActive}
        >
          {paused ? "Resume Training" : "Pause Training"}
        </Button>
      </div>
    </div>
  );
};

export default Workout;
