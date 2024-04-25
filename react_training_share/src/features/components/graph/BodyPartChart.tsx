// BodyPartChart.tsx

import React, { ChangeEvent, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Tabs, Tab, useMediaQuery, useTheme } from "@material-ui/core";
import styles from "./BodyPartChart.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

interface DataSet {
  label: string;
  data: { x: string; y: number }[];
  borderColor: string;
  fill: boolean;
}

interface ChartData {
  labels: string[];
  datasets: DataSet[];
}

interface WorkoutChartProps {
  trainingSessions: any[];
  selectedTab: number;
  onTabChange: (event: ChangeEvent<{}>, newValue: number) => void;
  trainingMenus: { id: number; name: string }[];
}

const bodyPartColors: { [key: number]: string } = {
  1: "#FF6384",
  2: "#36A2EB",
  3: "#FFCE56",
  4: "#4BC0C0",
  5: "#9966FF",
  6: "#FF9F40",
};

const WorkoutChart: React.FC<WorkoutChartProps> = ({
  trainingSessions,
  selectedTab,
  onTabChange,
  trainingMenus,
}) => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const labels = trainingSessions.map(
      (session) => new Date(session.date).toISOString().split("T")[0]
    );
    const datasets = trainingMenus.map((part) => ({
      label: part.name,
      data: trainingSessions.map((session) => ({
        x: session.date,
        y: session.workouts
          .filter(
            (workout: { body_part: string }) =>
              Number(workout.body_part) === part.id
          )
          .reduce(
            (acc: number, workout: { body_part: string; sets: any[] }) =>
              acc +
              workout.sets.reduce(
                (accSet, set) => accSet + set.weight * set.reps,
                0
              ),
            0
          ),
      })),
      borderColor: bodyPartColors[part.id],
      backgroundColor: bodyPartColors[part.id],
      fill: false,
    }));

    setChartData({ labels, datasets });
  }, [trainingSessions, trainingMenus]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className={styles.container}>
      <Tabs
        value={selectedTab}
        onChange={onTabChange}
        aria-label="body part tabs"
        // variant={isMobile ? "scrollable" : "standard"}
        // scrollButtons={isMobile ? "on" : "auto"}
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
        <Line
          data={{
            labels: chartData.labels,
            datasets:
              selectedTab === 0
                ? chartData.datasets
                : [chartData.datasets[selectedTab - 1]],
          }}
          options={{
            scales: {
              x: {
                type: "time",
                time: { unit: "day", displayFormats: { day: "yyyy-MM-dd" } },
                display: window.screen.width > 414,
              },
              y: {
                beginAtZero: true,
                display: window.screen.width > 414,
              },
            },
            // responsive: true,
            maintainAspectRatio: false,
          }}
          className={styles.chart}
        />
      </div>
    </div>
  );
};

export default WorkoutChart;
