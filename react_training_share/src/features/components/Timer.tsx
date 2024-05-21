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
  onSave: () => void;
  isPlan: boolean;
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
  onSave,
  isPlan,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={styles.bottomControls}>
      <div className={styles.timerAndButtonContainer}>
        {!isPlan && (
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
        )}
        <div className={styles.buttonContainer}>
          {!isPlan && !isActive && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={onPause}
                disabled
                className={styles.controlButton}
              >
                PAUSE
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={onStart}
                disabled={!hasWorkouts}
                className={styles.controlButton}
              >
                START
              </Button>
            </>
          )}
          {!isPlan && isActive && !isPaused && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={onPause}
                className={styles.controlButton}
              >
                PAUSE
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={onStop}
                className={styles.controlButton}
              >
                FINISH
              </Button>
            </>
          )}
          {!isPlan && isActive && isPaused && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={onResume}
                className={styles.controlButton}
              >
                RESUME
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={onStop}
                className={styles.controlButton}
              >
                FINISH
              </Button>
            </>
          )}
          {isPlan && (
            <Button
              variant="contained"
              color="primary"
              onClick={onSave}
              className={styles.saveButton}
            >
              トレーニングプランを保存
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;