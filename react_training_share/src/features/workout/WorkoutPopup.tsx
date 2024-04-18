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
import { Workout, setselectedWorkouts } from "./workoutPopupSlice";

const WorkoutPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const dispatch = useDispatch();
  const [selectedMenus, setSelectedMenus] = useState<Workout[]>([]);
  const [currentTab, setCurrentTab] = useState(0);
  const trainingMenus = useSelector(
    (state: RootState) => state.training.trainingMenus
  );

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };

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
    dispatch(setselectedWorkouts(selectedMenus));
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
          {trainingMenus[currentTab]?.training_menus.map((menu: Workout) => (
            <div key={menu.id} className={styles.menuItem}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMenus.some((m) => m.id === menu.id)}
                    onChange={() => handleToggle(menu.id, menu.name)}
                  />
                }
                label={menu.name}
              />
            </div>
          ))}
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
