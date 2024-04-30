// LineChartComponent.tsx
import React, { useState } from "react";
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
  const aggregateSessionsByDate = (sessions: PROPS_TRAINING_SESSION[]) => {
    return sessions.reduce((acc: PROPS_TRAINING_SESSION[], session) => {
      const existingIndex = acc.findIndex((s) => s.date === session.date);
      if (existingIndex !== -1) {
        const newSession = {
          ...acc[existingIndex],
          workouts: [...acc[existingIndex].workouts, ...session.workouts],
        };
        acc = [
          ...acc.slice(0, existingIndex),
          newSession,
          ...acc.slice(existingIndex + 1),
        ];
      } else {
        acc = [...acc, session];
      }
      return acc;
    }, []);
  };

  const calculateChartData = () => {
    const aggregatedSessions = aggregateSessionsByDate(trainingSessions);
    return {
      labels: aggregatedSessions.map((session) => session.date),
      datasets: trainingMenus.map((menu, index) => ({
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
