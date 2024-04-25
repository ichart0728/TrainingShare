// BodyPartChart.tsx

import React, { ChangeEvent, useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import { Tabs, Tab } from "@material-ui/core";
import styles from "./BodyPartChart.module.css";
import {
  ArcElement,
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
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

interface WorkoutChartProps {
  trainingSessions: any[];
  selectedTab: number;
  onTabChange: (event: ChangeEvent<{}>, newValue: number) => void;
  trainingMenus: { id: number; name: string }[];
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
  selectedTab,
  onTabChange,
  trainingMenus,
}) => {
  const [lineChartData, setLineChartData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [doughnutChartData, setDoughnutChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // 線グラフデータの設定
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

    setLineChartData({ labels, datasets });

    // 円グラフデータの設定
    const doughnutData = trainingMenus.map((part) =>
      trainingSessions.reduce(
        (acc, session) =>
          acc +
          session.workouts
            .filter(
              (workout: { body_part: string }) =>
                Number(workout.body_part) === part.id
            )
            .reduce(
              (sum: number, workout: { body_part: string; sets: any[] }) =>
                sum +
                workout.sets.reduce(
                  (setSum, set) => setSum + set.weight * set.reps,
                  0
                ),
              0
            ),
        0
      )
    );
    setDoughnutChartData({
      labels: trainingMenus.map((part) => part.name),
      datasets: [
        {
          data: doughnutData,
          backgroundColor: trainingMenus.map((part) => bodyPartColors[part.id]),
          label: "Workout Distribution",
        },
      ],
    });
  }, [trainingSessions, trainingMenus]);

  return (
    <div className={styles.container}>
      <div className={styles.lineChart}>
        <Tabs
          value={selectedTab}
          onChange={onTabChange}
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
          <Line
            data={{
              labels: lineChartData.labels,
              datasets:
                selectedTab === 0
                  ? lineChartData.datasets
                  : [lineChartData.datasets[selectedTab - 1]],
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
              maintainAspectRatio: false,
            }}
            className={styles.chart}
          />
        </div>
      </div>
      <div>
        <div className={styles.chartContainer}>
          <Pie
            data={doughnutChartData}
            options={{ maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkoutChart;
