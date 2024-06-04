import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import styles from "./ChartComponent.module.css";
import { PROPS_PIE_CHART, PROPS_TRAINING_SESSION } from "../../../types";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { IconButton } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";

ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

const PieChartComponent: React.FC<PROPS_PIE_CHART> = ({
  trainingSessions,
  trainingMenus,
  bodyPartColors,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const handlePreviousMonth = () => {
    setSelectedMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const isPreviousMonthDisabled = () => {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    return selectedMonth <= twelveMonthsAgo;
  };

  const isNextMonthDisabled = () => {
    const currentMonth = new Date();
    currentMonth.setDate(1); // 現在月の1日に設定
    currentMonth.setHours(0, 0, 0, 0); // 時間を00:00:00にリセット
    return selectedMonth >= currentMonth;
  };

  // 各トレーニングメニューごとの集計データを計算する
  // 選択した月のデータを集計
  const calculateData = () => {
    const monthStart = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      1
    );
    const monthEnd = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      0
    );

    const filteredSessions = trainingSessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= monthStart && sessionDate <= monthEnd;
    });

    const data = trainingMenus.map((menu) => {
      const total = filteredSessions.reduce((acc, session) => {
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
    <div className={styles.container}>
      <div className={styles.chartHeader}>
        <IconButton
          onClick={handlePreviousMonth}
          disabled={isPreviousMonthDisabled()}
          className={styles.navigationButton}
        >
          <ChevronLeft />
        </IconButton>
        <div className={styles.chartTitle}>
          {selectedMonth.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
          })}
        </div>
        <IconButton
          onClick={handleNextMonth}
          disabled={isNextMonthDisabled()}
          className={styles.navigationButton}
        >
          <ChevronRight />
        </IconButton>
      </div>
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
    </div>
  );
};

export default PieChartComponent;
