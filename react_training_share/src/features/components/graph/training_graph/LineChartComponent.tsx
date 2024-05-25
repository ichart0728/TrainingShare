import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import styles from "./ChartComponent.module.css";
import { PROPS_LINE_CHART, PROPS_TRAINING_SESSION } from "../../../types";
import ChartDataLabels from "chartjs-plugin-datalabels";
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
import { IconButton } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  ChartDataLabels,
  Tooltip,
  Legend
);

const LineChartComponent: React.FC<PROPS_LINE_CHART> = ({
  trainingSessions,
  trainingMenus,
  bodyPartColors,
  selectedTab,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const getOldestMonth = (trainingSessions: PROPS_TRAINING_SESSION[]) => {
    const allDates = trainingSessions.map((session) => new Date(session.date));
    return allDates.length > 0
      ? new Date(Math.min(...allDates.map((date) => date.getTime())))
      : null;
  };

  const getLatestMonth = (trainingSessions: PROPS_TRAINING_SESSION[]) => {
    const allDates = trainingSessions.map((session) => new Date(session.date));
    return allDates.length > 0
      ? new Date(Math.max(...allDates.map((date) => date.getTime())))
      : null;
  };

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
    const oldestMonth = getOldestMonth(trainingSessions);
    return (
      !oldestMonth ||
      (oldestMonth.getFullYear() >= selectedMonth.getFullYear() &&
        oldestMonth.getMonth() >= selectedMonth.getMonth())
    );
  };

  const isNextMonthDisabled = () => {
    const latestMonth = getLatestMonth(trainingSessions);
    return (
      !latestMonth ||
      (latestMonth.getFullYear() <= selectedMonth.getFullYear() &&
        latestMonth.getMonth() <= selectedMonth.getMonth())
    );
  };
  // 日付ごとにトレーニングセッションを集計する
  const aggregateSessionsByDate = (sessions: PROPS_TRAINING_SESSION[]) => {
    return sessions.reduce(
      (acc: { [key: string]: PROPS_TRAINING_SESSION }, session) => {
        const date = session.date;
        if (acc[date]) {
          acc[date].workouts.push(...session.workouts);
        } else {
          acc[date] = { ...session, workouts: [...session.workouts] };
        }
        return acc;
      },
      {}
    );
  };

  // 各トレーニングメニューごとの集計データを計算する
  const calculateChartData = () => {
    const aggregatedSessions = aggregateSessionsByDate(trainingSessions);

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

    const dates: string[] = [];
    const labels: string[] = [];
    for (let d = monthStart; d <= monthEnd; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split("T")[0]);
      labels.push(new Date(d).toLocaleDateString("ja-JP", { day: "numeric" }));
    }

    // 選択した月のデータを日付ごとに集計
    const datasets = trainingMenus.map((menu) => {
      const data = dates.map((date) => {
        const session = aggregatedSessions[date];
        if (session) {
          const workouts = session.workouts.filter(
            (workout) => Number(workout.body_part) === menu.id
          );
          if (workouts.length > 0) {
            return workouts.reduce((sum, workout) => {
              return (
                sum +
                workout.sets.reduce(
                  (setSum, set) => setSum + set.weight * set.reps,
                  0
                )
              );
            }, 0);
          }
        }
        return null;
      });

      return {
        label: menu.name,
        data: data,
        borderColor: bodyPartColors[menu.id],
        backgroundColor: bodyPartColors[menu.id],
        fill: false,
        spanGaps: true,
      };
    });

    return {
      labels,
      datasets,
    };
  };

  const chartData = calculateChartData();

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
                display: true,
              },
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              datalabels: {
                display: false,
              },
              legend: {
                position: "top",
                display: selectedTab === 0 ? true : false,
              },
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
};

export default LineChartComponent;
