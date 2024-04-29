// PieChartComponent.tsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./BodyPartChart.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

interface TrainingSession {
  id: string;
  date: string;
  duration: number;
  workouts: {
    id: string;
    menu: string;
    body_part: number;
    sets: {
      id: string;
      weight: number;
      reps: number;
      completed: boolean;
    }[];
  }[];
}

interface TrainingMenu {
  id: number;
  name: string;
}

interface PieChartProps {
  trainingSessions: TrainingSession[];
  trainingMenus: TrainingMenu[];
  bodyPartColors: { [key: number]: string };
}

const PieChartComponent: React.FC<PieChartProps> = ({
  trainingSessions,
  trainingMenus,
  bodyPartColors,
}) => {
  // 各トレーニングメニューごとの集計データを計算する
  const calculateData = () => {
    const data = trainingMenus.map((menu) => {
      const total = trainingSessions.reduce((acc, session) => {
        return (
          acc +
          session.workouts.reduce((workoutAcc, workout) => {
            if (Number(workout.body_part) === menu.id) {
              return (
                workoutAcc +
                workout.sets.reduce(
                  (setAcc, set) => setAcc + set.weight * set.reps,
                  0
                )
              );
            }
            return workoutAcc;
          }, 0)
        );
      }, 0);
      return total;
    });

    return {
      labels: trainingMenus.map((menu) => menu.name),
      datasets: [
        {
          data,
          backgroundColor: trainingMenus.map((part) => bodyPartColors[part.id]),
        },
      ],
    };
  };

  const chartData = calculateData();

  return (
    <div className={styles.chartContainer}>
      <Pie data={chartData} options={{ maintainAspectRatio: false }} />
    </div>
  );
};

export default PieChartComponent;
