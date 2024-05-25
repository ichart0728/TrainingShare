import React, { useState, useEffect } from "react";
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
}

const PastRecordsModal: React.FC<PastRecordsModalProps> = ({
  open,
  onClose,
  menuId,
  pastRecords,
}) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
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

  const filteredRecords = pastRecords
    .filter((record) =>
      record.workouts.some((workout) => workout.menu === menuId)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handlePrevDate = () => {
    setSelectedDateIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextDate = () => {
    setSelectedDateIndex((prevIndex) =>
      Math.min(prevIndex + 1, filteredRecords.length - 1)
    );
  };

  const selectedRecord = filteredRecords[selectedDateIndex];
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
        <div className={styles.modalHeader}>
          <Typography variant="h5" gutterBottom className={styles.modalTitle}>
            {targetName} | {menuName}
          </Typography>
          <div className={styles.dateNavigator}>
            <IconButton
              onClick={handlePrevDate}
              disabled={selectedDateIndex === 0}
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
              disabled={selectedDateIndex === filteredRecords.length - 1}
            >
              <ChevronRight />
            </IconButton>
          </div>
        </div>
        {selectedRecord && (
          <div className={styles.scrollableContent}>
            <Typography variant="subtitle1" className={styles.totalVolume}>
              総ボリューム: {totalVolume}kg
            </Typography>
            <TableContainer component={Paper} className={styles.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={styles.tableHeader}>セット</TableCell>
                    <TableCell align="center" className={styles.tableHeader}>
                      重量 (kg)
                    </TableCell>
                    <TableCell align="center" className={styles.tableHeader}>
                      回数
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedWorkout?.sets.map((set, index) => (
                    <TableRow key={index}>
                      <TableCell
                        component="th"
                        scope="row"
                        className={styles.tableCell}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell align="center" className={styles.tableCell}>
                        {set.weight}
                      </TableCell>
                      <TableCell align="center" className={styles.tableCell}>
                        {set.reps}
                      </TableCell>
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
