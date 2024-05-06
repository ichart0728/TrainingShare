import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { RootState } from "../../../app/store";
import { PROPS_TRAINING_SESSION, Training } from "../../types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { ChevronRight as ChevronRightIcon } from "@material-ui/icons";
import styles from "./SelectTrainingSessionModal.module.css";

interface SelectTrainingSessionModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSelectSession: (session: PROPS_TRAINING_SESSION) => void;
}

const SelectTrainingSessionModal: React.FC<SelectTrainingSessionModalProps> = ({
  open,
  onClose,
  selectedDate,
  onSelectSession,
}) => {
  const trainingSessions = useSelector(
    (state: RootState) => state.workoutHistory.trainingSessions
  );
  const trainings = useSelector(
    (state: RootState) => state.training.trainingMenus
  );

  const getTrainingTitle = (
    session: PROPS_TRAINING_SESSION,
    trainings: Training[]
  ) => {
    const bodyParts = session.workouts.map((workout) => {
      const training = trainings.find((t) => t.id === workout.body_part);
      return training ? training.name : "";
    });
    const uniqueBodyParts = Array.from(new Set(bodyParts));
    return uniqueBodyParts.join(", ");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <Typography variant="h6" align="center">
          トレーニングセッションを選択
        </Typography>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <List>
          {trainingSessions
            .filter((session) =>
              moment(session.date).isSame(selectedDate, "day")
            )
            .map((session) => (
              <ListItem
                key={session.id}
                button
                onClick={() => onSelectSession(session)}
                className={styles.listItem}
              >
                <ListItemText
                  primary={getTrainingTitle(session, trainings)}
                  secondary={"トレーニング時間: " + session.duration}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <ChevronRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default SelectTrainingSessionModal;
