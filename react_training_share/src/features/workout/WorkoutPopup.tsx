import { useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import {
  Modal,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import styles from "./WorkoutPopup.module.css";
import React, { useState } from "react";
import { setSelectedWorkout } from "./workoutPopupSlice";

const WorkoutPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const dispatch = useDispatch();
  const [selectedMenu, setSelectedMenu] = useState("");

  const trainingOptions = [
    { Name: "スクワット" },
    { Name: "ベンチプレス" },
    { Name: "デッドリフト" },
    { Name: "プルアップ" },
    // { id: 1, Name: "スクワット" },
    // { id: 2, Name: "ベンチプレス" },
    // { id: 3, Name: "デッドリフト" },
    // { id: 4, Name: "プルアップ" },
  ];

  const handleMenuChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    setSelectedMenu(event.target.value as string);
  };

  const handleAddTraining = () => {
    dispatch(setSelectedWorkout(selectedMenu));
    onClose();
  };

  return (
    <div className={styles.popupContainer}>
      <h2>Add Training Menu</h2>
      <FormControl fullWidth>
        <InputLabel>Menu</InputLabel>
        <Select value={selectedMenu} onChange={handleMenuChange}>
          {trainingOptions.map((option, index) => (
            <MenuItem key={index} value={option.Name}>
              {option.Name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddTraining}
        disabled={!selectedMenu}
      >
        Add
      </Button>
    </div>
  );
};

export default WorkoutPopup;
