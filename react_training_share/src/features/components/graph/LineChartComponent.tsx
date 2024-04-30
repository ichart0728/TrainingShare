import React from "react";
import { Line } from "react-chartjs-2";
import styles from "./BodyPartChart.module.css";
import { PROPS_LINE_CHART, PROPS_TRAINING_SESSION } from "../../types";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend
);

const LineChartComponent: React.FC<PROPS_LINE_CHART> = ({
  trainingSessions,
  trainingMenus,
  selectedTab,
  bodyPartColors,
}) => {
  // 日付ごとにトレーニングセッションを集計する
  const aggregateSessionsByDate = (sessions: PROPS_TRAINING_SESSION[]) => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    // 過去1週間のデータのみをフィルタリング
    const filteredSessions = sessions.filter(
      (session) =>
        new Date(session.date) >= oneWeekAgo && new Date(session.date) <= today
    );

    return filteredSessions.reduce((acc: PROPS_TRAINING_SESSION[], session) => {
      const existingIndex = acc.findIndex((s) => s.date === session.date);
      if (existingIndex !== -1) {
        const newSession = {
          ...acc[existingIndex],
          workouts: [...acc[existingIndex].workouts, ...session.workouts],
        };
        acc[existingIndex] = newSession;
      } else {
        acc.push(session);
      }
      return acc;
    }, []);
  };

  // 各トレーニングメニューごとの集計データを計算する
  const calculateChartData = () => {
    const aggregatedSessions = aggregateSessionsByDate(trainingSessions);
    return {
      labels: aggregatedSessions.map((session) => session.date),
      datasets: trainingMenus.map((menu) => ({
        label: menu.name,
        data: aggregatedSessions.map((session) => {
          return session.workouts
            .filter((workout) => Number(workout.body_part) === menu.id)
            .reduce((sum, workout) => {
              return (
                sum +
                workout.sets.reduce(
                  (setSum, set) => setSum + set.weight * set.reps,
                  0
                )
              );
            }, 0);
        }),
        borderColor: bodyPartColors[menu.id],
        backgroundColor: bodyPartColors[menu.id],
        fill: false,
      })),
    };
  };

  const chartData = calculateChartData();

  return (
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
              time: {
                unit: "day",
                displayFormats: {
                  day: "yyyy-MM-dd",
                },
                tooltipFormat: "MMM dd",
              },
              display: true,
            },
            y: {
              beginAtZero: true,
            },
          },
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default LineChartComponent;
