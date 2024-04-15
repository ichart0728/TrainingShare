import { useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import {
  Modal,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@material-ui/core";
import styles from "./WorkoutPopup.module.css";
import React, { useState } from "react";
import { setselectedWorkouts } from "./workoutPopupSlice";

const WorkoutPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const dispatch = useDispatch();
  const [selectedMenus, setSelectedMenus] = useState<any[]>([]);
  const trainingOptions = [
    { id: 1, Name: "スクワット" },
    { id: 2, Name: "ベンチプレス" },
    { id: 3, Name: "デッドリフト" },
    { id: 4, Name: "プルアップ" },
  ];

  const handleToggle = (id: number, name: string) => {
    const currentIndex = selectedMenus.findIndex((menu) => menu.id === id);
    const newChecked = [...selectedMenus];

    if (currentIndex === -1) {
      newChecked.push({ id, name });
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedMenus(newChecked);
  };

  const handleAddTraining = () => {
    selectedMenus.forEach((menu) => {
      dispatch(setselectedWorkouts(menu));
    });
    onClose();
  };

  return (
    <div className={styles.popupContainer}>
      <Typography variant="h6" gutterBottom>
        Add Training Menu
      </Typography>
      <FormControl component="fieldset" className={styles.formControl}>
        <FormGroup>
          {trainingOptions.map((option) => (
            <FormControlLabel
              key={option.id}
              control={
                <Checkbox
                  checked={selectedMenus.some((menu) => menu.id === option.id)}
                  onChange={() => handleToggle(option.id, option.Name)}
                />
              }
              label={option.Name}
            />
          ))}
        </FormGroup>
      </FormControl>
      <div className={styles.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTraining}
          disabled={selectedMenus.length === 0}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default WorkoutPopup;
