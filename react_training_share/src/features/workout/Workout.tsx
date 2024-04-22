import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WorkoutDisplay, startTimer, stopTimer } from "./workoutSlice";
import { fetchAsyncPostTrainingSessions } from "../api/workoutApi";
import { WORKOUT_POST } from "../types";

import styles from "./Workout.module.css";
import WorkoutPopup from "./WorkoutPopup";
import {
  Modal,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
} from "@material-ui/core";

import { RootState } from "../../app/store";
import WorkoutItem from "../components/WorkoutItem";

import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ClearIcon from "@material-ui/icons/Clear";
import PauseIcon from "@material-ui/icons/Pause";
import ReplayIcon from "@material-ui/icons/Replay";

const Workout = () => {
  const dispatch = useDispatch();

  const selectedWorkouts = useSelector(
    (state: RootState) => state.workout.workouts
  );
  const [openEndModal, setOpenEndModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
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
    const anyIncompleteSets = selectedWorkouts.some((workout) =>
      workout.sets.some((set) => !set.completed)
    );
    if (trainingActive) {
      setModalContent(
        anyIncompleteSets
          ? "完了していないセットがあります。トレーニングを終了しますか？"
          : "トレーニングを終了しますか？"
      );
      setOpenEndModal(true);
    } else {
      dispatch(startTimer());
      setTrainingActive(true);
      setPaused(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const confirmEndTraining = () => {
    dispatch(stopTimer());
    // トレーニングデータを整形
    const workouts = selectedWorkouts.map((workout) => ({
      menu: workout.menu,
      body_part: workout.body_part,
      sets: workout.sets.map((set) => ({
        weight: set.weight,
        reps: set.reps,
        completed: set.completed,
      })),
    }));
    const workoutData: WORKOUT_POST = {
      // YYYY-MM-DD形式の日付文字列
      date: new Date().toISOString().split("T")[0],
      duration: time,
      workouts: workouts,
    };
    console.log("送信するトレーニングデータ:", workoutData);
    dispatch(fetchAsyncPostTrainingSessions(workoutData) as any);
    setTrainingActive(false);
    setTime(0);
    setOpenEndModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseEndModal = () => {
    setOpenEndModal(false);
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
        <div className={styles.volumeAndTimerContainer}>
          <div className={styles.totalVolume}>
            <Typography variant="subtitle1" gutterBottom>
              Total Volume
              <br />
            </Typography>
            <Typography variant="h6" gutterBottom>
              {completedTotalVolume.toFixed(2)}/{totalVolume.toFixed(2)}kg
              <br />(
              {totalVolume > 0
                ? ((completedTotalVolume / totalVolume) * 100).toFixed(1)
                : "0"}
              %)
            </Typography>
          </div>

          <div className={styles.timer}>
            <Typography variant="subtitle1" gutterBottom>
              Timer
            </Typography>
            <Typography variant="h6" gutterBottom>
              {formatTime(time)}
            </Typography>
          </div>
        </div>{" "}
        <div className={styles.fixedWidthButtonContainer}>
          <Tooltip title={trainingActive ? "End Training" : "Start Training"}>
            <IconButton
              color={trainingActive ? "secondary" : "primary"}
              onClick={handleStartOrEnd}
              disabled={!selectedWorkouts.length}
            >
              {trainingActive ? (
                <ClearIcon fontSize="large" />
              ) : (
                <PlayArrowIcon fontSize="large" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title={paused ? "Resume Training" : "Pause Training"}>
            <IconButton
              color="primary"
              onClick={() => setPaused(!paused)}
              disabled={!trainingActive}
            >
              {paused ? (
                <ReplayIcon fontSize="large" />
              ) : (
                <PauseIcon fontSize="large" />
              )}
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className={styles.content}>
        <Modal open={openModal} onClose={handleCloseModal}>
          <WorkoutPopup open={openModal} onClose={handleCloseModal} />
        </Modal>
        <div className={styles.workoutList}>
          {selectedWorkouts.map((workout, index) => (
            <WorkoutItem key={index} workout={workout} />
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
      <Dialog open={openEndModal} onClose={handleCloseEndModal}>
        <DialogTitle>トレーニング終了</DialogTitle>
        <DialogContent>
          <DialogContentText>{modalContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEndModal} color="primary">
            キャンセル
          </Button>
          <Button onClick={confirmEndTraining} color="primary" autoFocus>
            終了
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Workout;
