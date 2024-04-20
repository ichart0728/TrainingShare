import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  Checkbox,
  FormControlLabel,
  Button,
  Tabs,
  Tab,
  Box,
} from "@material-ui/core";
import styles from "./WorkoutPopup.module.css";
import React, { useState } from "react";
import { WorkoutDisplay, selectedWorkout, addWorkout } from "./workoutSlice";
const WorkoutPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const dispatch = useDispatch();
  const [selectedMenus, setSelectedMenus] = useState<selectedWorkout[]>([]);
  const [currentTab, setCurrentTab] = useState(0);
  const trainingMenus = useSelector(
    (state: RootState) => state.training.trainingMenus
  );

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleToggle = (id: number, target: string, name: string) => {
    const currentIndex = selectedMenus.findIndex((menu) => menu.id === id);
    const newChecked = [...selectedMenus];

    if (currentIndex === -1) {
      newChecked.push({ id, target, name });
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedMenus(newChecked);
  };

  const handleAddTraining = () => {
    selectedMenus.forEach((menu) => {
      const workoutDisplay: WorkoutDisplay = {
        id: String(Date.now()),
        name: menu.name,
        target: menu.target,
        sets: [
          {
            id: String(Date.now()),
            weight: 0,
            reps: 0,
          },
        ],
      };
      dispatch(addWorkout(workoutDisplay));
    });
    onClose();
  };
  return (
    <div className={styles.popupContainer}>
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        variant="scrollable"
        scrollButtons="auto"
        className={styles.tabsContainer}
      >
        {trainingMenus.map((section, index) => (
          <Tab
            label={section.name}
            key={index}
            className={`${styles.tab} ${
              currentTab === index ? styles.tabSelected : ""
            }`}
          />
        ))}
      </Tabs>
      <div className={styles.contentContainer}>
        <Box className={styles.menuList}>
          {trainingMenus[currentTab]?.training_menus.map(
            (menu: selectedWorkout) => (
              <div key={menu.id} className={styles.menuItem}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedMenus.some((m) => m.id === menu.id)}
                      onChange={() =>
                        handleToggle(
                          menu.id,
                          trainingMenus[currentTab].name,
                          menu.name
                        )
                      }
                    />
                  }
                  label={menu.name}
                />
              </div>
            )
          )}
        </Box>
      </div>
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
