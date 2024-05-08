import React from "react";
import { Line } from "react-chartjs-2";
import styles from "./MuscleMassChart.module.css";
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

interface MuscleMassChartProps {
  muscleMassHistory: { muscleMass: number; date: string }[];
  selectedMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  isPreviousMonthDisabled: boolean;
  isNextMonthDisabled: boolean;
}

const MuscleMassChart: React.FC<MuscleMassChartProps> = ({
  muscleMassHistory,
  selectedMonth,
  onPreviousMonth,
  onNextMonth,
  isPreviousMonthDisabled,
  isNextMonthDisabled,
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

    const muscleMassData = labels.map((label) => {
      const data = muscleMassHistory.find(
        (item) =>
          new Date(item.date).getMonth() === selectedMonth.getMonth() &&
          new Date(item.date).getFullYear() === selectedMonth.getFullYear() &&
          new Date(item.date).toLocaleDateString("ja-JP", {
            day: "numeric",
          }) === label
      );
      return data ? data.muscleMass : null;
    });

    return {
      labels,
      datasets: [
        {
          data: muscleMassData,
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

export default MuscleMassChart;
