import React, { useState } from "react";
import {
  Modal,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
} from "@material-ui/core";
import { PROPS_TRAINING_SESSION, Training } from "../types";
import styles from "./PastRecordsModal.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { format, parseISO, differenceInDays } from "date-fns";
import { ja } from "date-fns/locale";

interface PastRecordsModalProps {
  open: boolean;
  onClose: () => void;
  menuId: number;
  pastRecords: PROPS_TRAINING_SESSION[];
  onLoadMore: () => void;
}

const PastRecordsModal: React.FC<PastRecordsModalProps> = ({
  open,
  onClose,
  menuId,
  pastRecords,
  onLoadMore,
}) => {
  const [selectedDate, setSelectedDate] = useState(0);
  const trainingMenus = useSelector(
    (state: RootState) => state.training.trainingMenus
  );

  const selectedMenu = trainingMenus.find((menu) =>
    menu.training_menus.some((m) => m.id === menuId)
  );
  const menuName = selectedMenu?.training_menus.find(
    (m) => m.id === menuId
  )?.name;
  const targetName = selectedMenu?.name;

  const handlePrevDate = () => {
    setSelectedDate(selectedDate - 1);
  };

  const handleNextDate = () => {
    setSelectedDate(selectedDate + 1);
  };

  const selectedRecord = pastRecords[selectedDate];
  const selectedWorkout = selectedRecord?.workouts.find(
    (workout) => workout.menu === menuId
  );

  const totalVolume = selectedWorkout?.sets.reduce(
    (acc, set) => acc + set.weight * set.reps,
    0
  );

  return (
    <Modal open={open} onClose={onClose} className={styles.modal}>
      <div className={styles.modalContent}>
        <Typography variant="h5" gutterBottom className={styles.modalTitle}>
          {targetName} | {menuName}
        </Typography>
        {selectedRecord && (
          <div className={styles.scrollableContent}>
            <div className={styles.dateNavigator}>
              <IconButton
                onClick={handlePrevDate}
                disabled={selectedDate === 0}
              >
                <ChevronLeft />
              </IconButton>
              <Typography variant="h6" className={styles.date}>
                {format(parseISO(selectedRecord.date), "yyyy年M月d日", {
                  locale: ja,
                })}
                （{differenceInDays(new Date(), parseISO(selectedRecord.date))}
                日前）
              </Typography>
              <IconButton
                onClick={handleNextDate}
                disabled={selectedDate === pastRecords.length - 1}
              >
                <ChevronRight />
              </IconButton>
            </div>
            <Typography variant="subtitle1" className={styles.totalVolume}>
              総ボリューム: {totalVolume}kg
            </Typography>
            <TableContainer component={Paper} className={styles.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={styles.tableHeader}>セット</TableCell>
                    <TableCell align="right" className={styles.tableHeader}>
                      重量 (kg)
                    </TableCell>
                    <TableCell align="right" className={styles.tableHeader}>
                      回数
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedWorkout?.sets.map((set, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="right">{set.weight}</TableCell>
                      <TableCell align="right">{set.reps}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className={styles.memoContainer}>
              <Typography variant="subtitle1">メモ</Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={selectedWorkout?.memo || ""}
                InputProps={{
                  readOnly: true,
                  className: styles.memoInput,
                }}
              />
            </div>
          </div>
        )}
        <div className={styles.closeButtonContainer}>
          <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
            className={styles.closeButton}
          >
            閉じる
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PastRecordsModal;
