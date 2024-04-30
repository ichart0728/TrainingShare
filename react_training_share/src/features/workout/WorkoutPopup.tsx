import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  Checkbox,
  FormControlLabel,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
} from "@material-ui/core";
import styles from "./WorkoutPopup.module.css";
import React, { useState } from "react";
import { PROPS_WORKOUT_DISPLAY, addWorkout } from "./workoutSlice";
import { AppDispatch } from "../../app/store";
import { v4 as uuidv4 } from "uuid";

const WorkoutPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedMenus, setSelectedMenus] = useState<number[]>([]); // 選択されたメニューのIDを保持
  const [currentTab, setCurrentTab] = useState(0);
  const trainingMenus = useSelector(
    (state: RootState) => state.training.trainingMenus
  );

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleToggle = (menuId: number) => {
    const index = selectedMenus.indexOf(menuId);
    if (index === -1) {
      // 選択されていない場合
      // 選択されたメニューのIDを追加
      setSelectedMenus([...selectedMenus, menuId]);
    } else {
      // 選択されている場合
      // 選択されたメニューのIDを削除
      setSelectedMenus(selectedMenus.filter((id) => id !== menuId));
    }
    console.log("selectedMenus1: ", selectedMenus);
  };

  const handleAddTraining = () => {
    // menuId: トレーニングメニューのID
    selectedMenus.forEach((menuId) => {
      // body_part: 部位のID
      const body_part = trainingMenus[currentTab].id;
      // 選択された部位に含まれるトレーニングメニューを取得
      const training_menus = trainingMenus[currentTab].training_menus;
      // 選択されたトレーニングメニューの情報を取得
      const menu = training_menus.find((menu) => menu.id === menuId);

      if (menu) {
        const workoutDisplay: PROPS_WORKOUT_DISPLAY = {
          id: uuidv4(),
          menu: menu.id,
          body_part: body_part,
          sets: [
            {
              id: uuidv4(),
              weight: 0,
              reps: 0,
              completed: false,
            },
          ],
        };
        dispatch(addWorkout(workoutDisplay));
      }
    });
    onClose();
  };

  return (
    <div className={styles.popupContainer}>
      <Typography variant="h6" gutterBottom className={styles.popupTitle}>
        トレーニング選択
      </Typography>
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
          {trainingMenus[currentTab]?.training_menus.map((menu) => (
            <div key={menu.id} className={styles.menuItem}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMenus.includes(menu.id)}
                    onChange={() => handleToggle(menu.id)}
                    color="primary"
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
          className={styles.addButton}
        >
          トレーニングを追加する
        </Button>
      </div>
    </div>
  );
};

export default WorkoutPopup;
