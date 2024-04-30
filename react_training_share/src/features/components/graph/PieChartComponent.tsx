import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./BodyPartChart.module.css";
import { PROPS_PIE_CHART } from "../../types";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent: React.FC<PROPS_PIE_CHART> = ({
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

    const hasData = data.some((value) => value !== 0);

    return {
      labels: hasData ? trainingMenus.map((menu) => menu.name) : [],
      datasets: [
        {
          data: hasData ? data : Array(trainingMenus.length).fill(1),
          backgroundColor: hasData
            ? trainingMenus.map((part) => bodyPartColors[part.id])
            : Array(trainingMenus.length).fill("rgba(200, 200, 200, 0.6)"),
          borderColor: "#ffffff", // セグメント間の境界線色
          borderWidth: 2, // セグメント間の境界線の太さ
        },
      ],
    };
  };

  const chartData = calculateData();

  return (
    <div className={styles.chartContainer}>
      <Pie
        data={chartData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top", // 凡例の位置
              labels: {
                font: {
                  size: 14, // ラベルフォントサイズ
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw} kg`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PieChartComponent;
