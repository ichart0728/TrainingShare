// BodyPartChart.tsx

import React from "react";
import { Tabs, Tab } from "@material-ui/core";
import styles from "./BodyPartChart.module.css";
import {
  ArcElement,
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  TimeScale,
  CategoryScale,
  LinearScale,
} from "chart.js";

import "chartjs-adapter-date-fns";
import LineChartComponent from "./LineChartComponent";
import PieChartComponent from "./PieChartComponent";
import RadarChartComponent from "./RadarChartComponent";

ChartJS.register(
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  TimeScale,
  CategoryScale,
  LinearScale
);

interface Set {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

interface Workout {
  id: string;
  menu: string;
  body_part: string;
  sets: Set[];
}

interface TrainingSession {
  id: string;
  date: string;
  duration: number;
  workouts: Workout[];
}

interface TrainingMenu {
  id: number;
  name: string;
}
interface WorkoutChartProps {
  trainingSessions: TrainingSession[];
  trainingMenus: TrainingMenu[];
}

const bodyPartColors: { [key: number]: string } = {
  1: "#3498DB", // 明るいブルー
  2: "#2ECC71", // 明るいグリーン
  3: "#F39C12", // 明るいオレンジ
  4: "#1ABC9C", // ティール
  5: "#9B59B6", // アメジスト
  6: "#34495E", // アスファルト（ダークグレー）
};

const WorkoutChart: React.FC<WorkoutChartProps> = ({
  trainingSessions,
  trainingMenus,
}) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };
  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="body part tabs"
          variant="scrollable"
          scrollButtons="on"
          className={styles.tabsContainer}
        >
          <Tab label="すべて" className={styles.tab} />
          {trainingMenus.map((part) => (
            <Tab label={part.name} key={part.id} className={styles.tab} />
          ))}
        </Tabs>
        <div className={styles.chartContainer}>
          <div className={styles.chart}>
            <LineChartComponent
              trainingSessions={trainingSessions}
              trainingMenus={trainingMenus}
              selectedTab={selectedTab}
              bodyPartColors={bodyPartColors}
            />
          </div>
        </div>
      </div>
      <div className={styles.chart}>
        <div>
          <PieChartComponent
            trainingSessions={trainingSessions}
            trainingMenus={trainingMenus}
            bodyPartColors={bodyPartColors}
          />
        </div>
      </div>
      <div className={styles.chart}>
        <div>
          <RadarChartComponent
            trainingSessions={trainingSessions}
            trainingMenus={trainingMenus}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkoutChart;
