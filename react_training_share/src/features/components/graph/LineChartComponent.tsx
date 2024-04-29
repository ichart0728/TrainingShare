// LineChartComponent.tsx
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import styles from "./BodyPartChart.module.css";

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

interface LineChartProps {
  trainingSessions: TrainingSession[];
  trainingMenus: TrainingMenu[];
  selectedTab: number;
  bodyPartColors: { [key: number]: string };
}

const LineChartComponent: React.FC<LineChartProps> = ({
  trainingSessions,
  trainingMenus,
  selectedTab,
  bodyPartColors,
}) => {
  const aggregateSessionsByDate = (sessions: TrainingSession[]) => {
    return sessions.reduce((acc: TrainingSession[], session) => {
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
