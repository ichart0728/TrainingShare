// WorkoutHistory.tsx
import React, { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import "chartjs-adapter-date-fns";
import BodyPartChart from "../components/graph/BodyPartChart";
import styles from "./WorkoutHistory.module.css"; // CSSをインポート

const WorkoutHistory = () => {
  const trainingSessions = useSelector(
    (state: RootState) => state.workoutHistory.trainingSessions
  );
  const trainingMenus = useSelector(
    (state: RootState) => state.training.trainingMenus
  );
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div className={styles.historyContainer}>
      {" "}
      <BodyPartChart
        trainingSessions={trainingSessions}
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        trainingMenus={trainingMenus}
      />
    </div>
  );
};

export default WorkoutHistory;
