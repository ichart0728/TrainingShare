import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  WorkoutState,
  startTimer,
  stopTimer,
  pauseTimer,
} from "./workoutSlice";
import styles from "./Workout.module.css";
import WorkoutPopup from "./WorkoutPopup";
import { Modal, Button, Typography } from "@material-ui/core";
import { RootState } from "../../app/store";
import WorkoutItem from "../components/WorkoutItem";

const Workout = () => {
  const dispatch = useDispatch();

  const selectedWorkouts = useSelector(
    (state: RootState) => state.workout.workouts
  );
  // const totalVolume = useSelector(selectTotalVolume);

  // selectedWorkoutsの全体のボリュームを計算
  const totalVolume = selectedWorkouts.reduce((total, workout) => {
    return (
      total +
      workout.sets.reduce((setTotal, set) => {
        return setTotal + set.weight * set.reps;
      }, 0)
    );
  }, 0);
  // selectedWorkoutsのうち完了済みの全体のボリュームを計算
  const completedTotalVolume = selectedWorkouts.reduce((total, workout) => {
    return (
      total +
      workout.sets.reduce((setTotal, set) => {
        return set.completed ? setTotal + set.weight * set.reps : setTotal;
      }, 0)
    );
  }, 0);
  const [openModal, setOpenModal] = useState(false);
  const [trainingActive, setTrainingActive] = useState(false);
  const [paused, setPaused] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: any = null;

    if (trainingActive && !paused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [trainingActive, paused]);

  const handleStartOrEnd = () => {
    if (trainingActive) {
      dispatch(stopTimer());
      setTrainingActive(false);
      setTime(0);
    } else {
      dispatch(startTimer());
      setTrainingActive(true);
      setPaused(false);
    }
  };

  const togglePause = () => {
    if (paused) {
      dispatch(startTimer());
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.topControls}>
        <Typography variant="h4" gutterBottom>
          Workout Tracker
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          className={styles.totalVolume}
        >
          全体のボリューム: <br /> {completedTotalVolume}/{totalVolume}kg (
          {totalVolume > 0
            ? ((completedTotalVolume / totalVolume) * 100).toFixed(1)
            : "0"}
          %)
        </Typography>

        <Typography variant="h6" gutterBottom className={styles.digitalClock}>
          Timer: {formatTime(time)}
        </Typography>
        <div className={styles.fixedWidthButtonContainer}>
          <Button
            className={styles.fixedWidthButton}
            variant="contained"
            color={trainingActive ? "secondary" : "primary"}
            onClick={handleStartOrEnd}
            disabled={paused}
          >
            {trainingActive ? "終了" : "スタート"}
          </Button>
          <Button
            className={`${styles.fixedWidthButton} ${
              paused ? styles.pauseButtonPaused : ""
            }`}
            variant="contained"
            color="primary"
            onClick={togglePause}
            disabled={!trainingActive}
          >
            {paused ? "再開" : "一時停止"}
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <Modal open={openModal} onClose={handleCloseModal}>
          <WorkoutPopup open={openModal} onClose={handleCloseModal} />
        </Modal>
        <div className={styles.workoutList}>
          {selectedWorkouts.map((workout, index) => (
            <WorkoutItem key={index} workout={workout} index={index} />
          ))}
        </div>
      </div>
      <div className={styles.bottomControls}>
        <Button
          className={styles.bottomButton}
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
        >
          トレーニングを追加
        </Button>
      </div>
    </div>
  );
};

export default Workout;
