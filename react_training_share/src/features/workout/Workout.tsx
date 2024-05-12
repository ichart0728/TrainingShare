import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearWorkouts,
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  updateElapsedTime,
  selectTimer,
  selectElapsedTime,
} from "./workoutSlice";
import { fetchAsyncPostTrainingSessions } from "../api/workoutApi";
import { fetchAsyncGetTrainingSessions } from "../api/workoutApi";
import { WORKOUT_POST } from "../types";
import { AppDispatch } from "../../app/store";
import styles from "./Workout.module.css";
import WorkoutModal from "../components/modal/WorkoutModal";
import {
  Modal,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

import { RootState } from "../../app/store";
import WorkoutItemEdit from "../components/WorkoutItemEdit";
import { useNavigate } from "react-router-dom";

const Workout = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

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
  const timer = useSelector(selectTimer);
  const elapsedTime = useSelector(selectElapsedTime);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (timer.active && !timer.paused) {
      timerId = setInterval(() => {
        dispatch(updateElapsedTime());
      }, 1000);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [timer.active, timer.paused, dispatch]);

  useEffect(() => {
    if (timer.active && !timer.paused) {
      dispatch(updateElapsedTime());
    }
  }, [timer.active, timer.paused, dispatch]);

  const handleStartTimer = () => {
    dispatch(startTimer());
  };

  const handlePauseTimer = () => {
    dispatch(pauseTimer());
  };

  const handleResumeTimer = () => {
    dispatch(resumeTimer());
  };

  const handleStopTimer = () => {
    const anyIncompleteSets = selectedWorkouts.some((workout) =>
      workout.sets.some((set) => !set.completed)
    );
    setModalContent(
      anyIncompleteSets
        ? "完了していないセットがあります。トレーニングを終了しますか？"
        : "トレーニングを終了しますか？"
    );
    setOpenEndModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const confirmEndTrainingWithoutSaving = () => {
    dispatch(stopTimer());
    setOpenEndModal(false);
    dispatch(clearWorkouts());
    navigate("/workout_history");
  };

  const confirmEndTrainingWithSaving = () => {
    dispatch(stopTimer());
    // トレーニングデータを整形
    const workouts = selectedWorkouts
      .filter((workout) => workout.sets.length > 0)
      .map((workout) => ({
        id: workout.id,
        menu: workout.menu,
        body_part: workout.body_part,
        sets: workout.sets.map((set) => ({
          id: set.id,
          weight: Math.round(set.weight * 100) / 100,
          reps: set.reps,
          completed: set.completed,
        })),
      }));
    const workoutData: WORKOUT_POST = {
      // YYYY-MM-DD形式の日付文字列
      date: new Date().toISOString().split("T")[0],
      duration: Math.floor(elapsedTime / 1000), // ミリ秒を秒に変換
      workouts: workouts,
    };
    console.log("送信するトレーニングデータ:", workoutData);
    dispatch(fetchAsyncPostTrainingSessions(workoutData) as any);
    setOpenEndModal(false);
    dispatch(clearWorkouts());
    dispatch(fetchAsyncGetTrainingSessions());
    navigate("/workout_history");
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseEndModal = () => {
    setOpenEndModal(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.topControls}>
        <div className={styles.totalVolume}>
          <Typography variant="subtitle2" gutterBottom>
            合計ボリューム
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
      </div>
      <div className={styles.content}>
        <Modal open={openModal} onClose={handleCloseModal}>
          <WorkoutModal open={openModal} onClose={handleCloseModal} />
        </Modal>
        <div className={styles.workoutList}>
          {selectedWorkouts.map((workout, index) => (
            <WorkoutItemEdit key={index} workout={workout} />
          ))}
        </div>
        <div className={styles.AddTrainingButton}>
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
      <div className={styles.bottomControls}>
        <div className={styles.timerAndButtonContainer}>
          <div className={styles.timer}>
            <Typography variant="subtitle2" gutterBottom>
              経過時間
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              className={`${styles.timerTextContainer} ${
                timer.paused ? styles.pausedTimer : ""
              }`}
            >
              {formatTime(elapsedTime)}
            </Typography>
          </div>
          <div className={styles.buttonContainer}>
            {!timer.active && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePauseTimer}
                  disabled
                  className={styles.fixedWidthButton}
                >
                  PAUSE
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStartTimer}
                  disabled={!selectedWorkouts.length}
                  className={styles.fixedWidthButton}
                >
                  START
                </Button>
              </>
            )}
            {timer.active && !timer.paused && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePauseTimer}
                  className={styles.fixedWidthButton}
                >
                  PAUSE
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleStopTimer}
                  className={styles.fixedWidthButton}
                >
                  FINISH
                </Button>
              </>
            )}
            {timer.active && timer.paused && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleResumeTimer}
                  className={styles.fixedWidthButton}
                >
                  RESUME
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleStopTimer}
                  className={styles.fixedWidthButton}
                >
                  FINISH
                </Button>
              </>
            )}
          </div>
        </div>
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
          <Button onClick={confirmEndTrainingWithSaving} color="primary">
            保存して終了
          </Button>
          <Button onClick={confirmEndTrainingWithoutSaving} color="secondary">
            保存せずに終了
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Workout;
