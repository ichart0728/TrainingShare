import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import styles from "./BodyPartChart.module.css";
import { PROPS_LINE_CHART, PROPS_TRAINING_SESSION } from "../../types";
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
  selectedTab,
  bodyPartColors,
  selectedMonth,
  onPreviousMonth,
  onNextMonth,
  isPreviousMonthDisabled,
  isNextMonthDisabled,
}) => {
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

    const labels: string[] = [];
    for (let d = monthStart; d <= monthEnd; d.setDate(d.getDate() + 1)) {
      labels.push(new Date(d).toISOString().split("T")[0]);
    }

    // 選択した月のデータを日付ごとに集計
    const datasets = trainingMenus.map((menu) => {
      const data = labels.map((label) => {
        const session = aggregatedSessions[label];
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

  // 過去1年間の最大値を計算
  // const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    const oneYearAgo = new Date(selectedMonth);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const filteredSessions = trainingSessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= oneYearAgo && sessionDate <= selectedMonth;
    });

    // const maxValues = trainingMenus.map((menu) => {
    //   const menuSessions = filteredSessions.flatMap((session) =>
    //     session.workouts.filter(
    //       (workout) => Number(workout.body_part) === menu.id
    //     )
    //   );
    //   const menuMaxValue = menuSessions.reduce((max, workout) => {
    //     const workoutValue = workout.sets.reduce(
    //       (sum, set) => sum + set.weight * set.reps,
    //       0
    //     );
    //     return Math.max(max, workoutValue);
    //   }, 0);
    //   return menuMaxValue;
    // });

    // const overallMaxValue = Math.max(...maxValues);

    // setMaxValue(overallMaxValue);
  }, [selectedMonth, trainingSessions, trainingMenus]);

  const MaxValueDatasets = chartData.datasets.map((dataset) => {
    const data = dataset.data.map((value) => (value !== null ? value : 0));
    return {
      ...dataset,
      data: data,
    };
  });

  // 選択された部位の最大値を計算
  // const selectedPartMaxValue =
  //   selectedTab === 0
  //     ? maxValue
  //     : chartData.MaxValueDatasets[selectedTab - 1].data.reduce(
  //         (max, value) => {
  //           return value !== null && value !== undefined
  //             ? Math.max(max, value)
  //             : max;
  //         },
  //         0
  //       );

  return (
    <div className={styles.container}>
      <div className={styles.chartHeader}>
        <IconButton
          onClick={onPreviousMonth}
          disabled={isPreviousMonthDisabled}
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
          onClick={onNextMonth}
          disabled={isNextMonthDisabled}
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
                // max: selectedPartMaxValue,
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
