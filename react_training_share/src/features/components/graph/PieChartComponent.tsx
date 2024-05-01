import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import styles from "./BodyPartChart.module.css";
import { PROPS_PIE_CHART } from "../../types";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

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
    const totalData = data.reduce((acc, value) => acc + value, 0);

    return {
      labels: hasData ? trainingMenus.map((menu) => menu.name) : ["No data"],
      datasets: [
        {
          data: hasData ? data : [1],
          backgroundColor: hasData
            ? trainingMenus.map((part) => bodyPartColors[part.id])
            : ["rgba(200, 200, 200, 0.6)"],
          borderColor: "#ffffff", // セグメント間の境界線色
          borderWidth: 2, // セグメント間の境界線の太さ
        },
      ],
      totalData,
      hasData,
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
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  if (!chartData.hasData) {
                    return "";
                  }
                  return `${tooltipItem.label}: ${tooltipItem.raw} kg`;
                },
              },
            },
            datalabels: {
              formatter: (value, ctx) => {
                if (!chartData.hasData) {
                  return "";
                }
                const label = ctx.chart.data.labels?.[ctx.dataIndex];
                const percentage = (
                  (value / chartData.totalData) *
                  100
                ).toFixed(1);
                return `${label}\n${percentage}%`;
              },
              color: "#fff",
              font: {
                size: 12,
                weight: "bold",
              },
              textAlign: "center",
              padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              },
              offset: 0,
              display: function (ctx) {
                const value = ctx.dataset.data[ctx.dataIndex];
                return value !== 0;
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PieChartComponent;
