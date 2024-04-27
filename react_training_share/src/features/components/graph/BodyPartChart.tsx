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
  selectedTab: number;
  onTabChange: (event: ChangeEvent<{}>, newValue: number) => void;
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

  const aggregateSessionsByDate = (sessions: TrainingSession[]) => {
    return sessions.reduce((acc: TrainingSession[], session) => {
      const existingIndex = acc.findIndex((s) => s.date === session.date);
      if (existingIndex !== -1) {
        // 既存のセッションがあれば、新しいworkoutsを追加して新しいセッションオブジェクトを作成
        const newSession = {
          ...acc[existingIndex],
          workouts: [...acc[existingIndex].workouts, ...session.workouts],
        };
        // 既存のセッションを新しいもので置き換え
        const newAcc = [...acc];
        newAcc[existingIndex] = newSession;
        return newAcc;
      } else {
        // 新しい日付の場合は、そのまま追加
        return [...acc, session];
      }
    }, []);
  };

  useEffect(() => {
    // 本日から過去1ヶ月の日付を取得
    const labels = [
      new Date(new Date().setDate(new Date().getDate() - 7))
        .toISOString()
        .split("T")[0],
      new Date().toISOString().split("T")[0],
    ];

    // trainingMenusから日付ごとにトレーニングメニューの合計重量を取得
    const aggregatedSessions = aggregateSessionsByDate(trainingSessions);

    // 線グラフデータの設定
    const datasets = trainingMenus.map((part) => ({
      label: part.name,
      data: aggregatedSessions.map((session: TrainingSession) => ({
        x: session.date,
        y: session.workouts
          .filter((workout: Workout) => Number(workout.body_part) === part.id)
          .reduce(
            (acc: number, workout: Workout) =>
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
        (acc, session: TrainingSession) =>
          acc +
          session.workouts
            .filter((workout: Workout) => Number(workout.body_part) === part.id)
            .reduce(
              (sum: number, workout: Workout) =>
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
                  display: window.screen.width > 414 ? true : false,
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
