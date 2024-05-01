import React from "react";
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

    // 現在日付から過去1ヶ月分の日付を生成
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const labels: string[] = [];
    for (let d = oneMonthAgo; d <= today; d.setDate(d.getDate() + 1)) {
      labels.push(new Date(d).toISOString().split("T")[0]);
    }

    // 現在日付から過去1ヶ月分のデータを日付ごとに集計
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
  );
};

export default LineChartComponent;
