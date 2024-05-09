import React from "react";
import { Line } from "react-chartjs-2";
import styles from "./WeightChart.module.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
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
  Tooltip
);

interface WeightChartProps {
  weightHistory: { weight: number; date: string }[];
  selectedMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  isPreviousMonthDisabled: boolean;
  isNextMonthDisabled: boolean;
  maxWeight: number;
  minWeight: number;
}

const WeightChart: React.FC<WeightChartProps> = ({
  weightHistory,
  selectedMonth,
  onPreviousMonth,
  onNextMonth,
  isPreviousMonthDisabled,
  isNextMonthDisabled,
  maxWeight,
  minWeight,
}) => {
  const calculateChartData = () => {
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
      labels.push(new Date(d).toLocaleDateString("ja-JP", { day: "numeric" }));
    }

    const weightData = labels.map((label) => {
      const data = weightHistory.find(
        (item) =>
          new Date(item.date).getMonth() === selectedMonth.getMonth() &&
          new Date(item.date).getFullYear() === selectedMonth.getFullYear() &&
          new Date(item.date).toLocaleDateString("ja-JP", {
            day: "numeric",
          }) === label
      );
      return data ? data.weight : null;
    });

    return {
      labels,
      datasets: [
        {
          data: weightData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: false,
          spanGaps: true,
        },
      ],
    };
  };

  const chartData = calculateChartData();

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
            datasets: chartData.datasets,
          }}
          options={{
            scales: {
              x: {
                display: true,
              },
              y: {
                beginAtZero: true,
                // グラフの上下を余分に表示する
                max: maxWeight + 10,
                min: minWeight - 10,
                ticks: {
                  stepSize: 5,
                },
              },
            },
            plugins: {
              datalabels: {
                display: false,
              },
              legend: {
                display: false,
              },
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
};

export default WeightChart;
