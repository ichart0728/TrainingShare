import React, { useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { v4 as uuidv4 } from "uuid";
import { addWorkout } from "./workoutSlice";
import styles from "./WorkoutPopup.module.css";
import { PROPS_WORKOUT } from "../types";

interface MenuSelection {
  [key: number]: number[]; // タブのインデックスごとに選択されたメニューIDのリストを保持
}

const WorkoutPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const dispatch: AppDispatch = useDispatch();
  // タブごとに選択されたメニューを保持する
  const [menuSelections, setMenuSelections] = useState<MenuSelection>({});
  // 現在のタブ
  const [currentTab, setCurrentTab] = useState(0);
  // トレーニングメニューのリスト
  const trainingMenus = useSelector(
    (state: RootState) => state.training.trainingMenus
  );

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleToggle = (menuId: number) => {
    // 現在のタブの選択されたメニューIDリストを取得
    const currentSelections = menuSelections[currentTab] || [];
    // 選択されたメニューIDが既に選択されているかを確認
    const index = currentSelections.indexOf(menuId);
    // 選択されていない場合は追加、選択されている場合は削除
    const updatedSelections =
      index === -1
        ? [...currentSelections, menuId]
        : currentSelections.filter((id) => id !== menuId);

    setMenuSelections({
      ...menuSelections,
      [currentTab]: updatedSelections,
    });
  };

  const handleAddTraining = () => {
    // 選択されたメニューを元にWorkoutDisplayを作成し、storeに追加
    Object.entries(menuSelections).forEach(([tabIndex, menuIds]) => {
      const body_part = trainingMenus[parseInt(tabIndex)].id;
      const training_menus = trainingMenus[parseInt(tabIndex)].training_menus;

      menuIds.forEach((menuId: number) => {
        const menu = training_menus.find((menu) => menu.id === menuId);
        if (menu) {
          const workoutDisplay: PROPS_WORKOUT = {
            id: uuidv4(),
            menu: String(menu.id),
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
                    checked={
                      menuSelections[currentTab]?.includes(menu.id) || false
                    }
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
          disabled={Object.keys(menuSelections).every(
            (key) => menuSelections[Number(key)].length === 0
          )}
          className={styles.addButton}
        >
          トレーニングを追加する
        </Button>
      </div>
    </div>
  );
};

export default WorkoutPopup;
