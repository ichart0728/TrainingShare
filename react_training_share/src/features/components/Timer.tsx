import React from "react";
import { Button, Typography } from "@material-ui/core";
import styles from "./Timer.module.css";

interface TimerProps {
  elapsedTime: number;
  isActive: boolean;
  isPaused: boolean;
  hasWorkouts: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

const Timer: React.FC<TimerProps> = ({
  elapsedTime,
  isActive,
  isPaused,
  hasWorkouts,
  onStart,
  onPause,
  onResume,
  onStop,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={styles.timerAndButtonContainer}>
      <div className={styles.timer}>
        <Typography variant="subtitle2" gutterBottom>
          経過時間
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          className={`${styles.timerTextContainer} ${
            isPaused ? styles.pausedTimer : ""
          }`}
        >
          {formatTime(elapsedTime)}
        </Typography>
      </div>
      <div className={styles.buttonContainer}>
        {!isActive && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={onPause}
              disabled
              className={styles.fixedWidthButton}
            >
              PAUSE
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onStart}
              disabled={!hasWorkouts}
              className={styles.fixedWidthButton}
            >
              START
            </Button>
          </>
        )}
        {isActive && !isPaused && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={onPause}
              className={styles.fixedWidthButton}
            >
              PAUSE
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={onStop}
              className={styles.fixedWidthButton}
            >
              FINISH
            </Button>
          </>
        )}
        {isActive && isPaused && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={onResume}
              className={styles.fixedWidthButton}
            >
              RESUME
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={onStop}
              className={styles.fixedWidthButton}
            >
              FINISH
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Timer;
