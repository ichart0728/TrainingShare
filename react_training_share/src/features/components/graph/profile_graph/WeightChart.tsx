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
import { PROPS_WEIGHT_CHART } from "../../../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  ChartDataLabels,
  Tooltip
);

const WeightChart: React.FC<PROPS_WEIGHT_CHART> = ({
  weightHistory,
  selectedMonth,
  onPreviousMonth,
  onNextMonth,
  maxWeight,
  minWeight,
  onDataPointClick,
  selectedDataPoint,
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
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: (context: any) => {
            const index = context.dataIndex;
            const date = labels[index];
            return date === selectedDataPoint
              ? "rgba(255, 0, 0, 1)"
              : "rgba(75, 192, 192, 1)";
          },
          pointBorderColor: (context: any) => {
            const index = context.dataIndex;
            const date = labels[index];
            return date === selectedDataPoint
              ? "rgba(255, 0, 0, 1)"
              : "rgba(75, 192, 192, 1)";
          },
        },
      ],
    };
  };

  const chartData = calculateChartData();

  const handleDataPointClick = (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const dateLabel = chartData.labels[index];
      const weight = chartData.datasets[0].data[index];

      if (weight !== null) {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const selectedDay = parseInt(dateLabel, 10);

        // UTCとして解釈されるが、日本時間として解釈するために9時間追加
        const utcDate = new Date(Date.UTC(year, month, selectedDay));
        const jstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

        const formattedDate = jstDate.toISOString().split("T")[0];
        onDataPointClick(formattedDate, weight);
      }
    }
  };

  const isPreviousMonthDisabled = () => {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    return selectedMonth <= twelveMonthsAgo;
  };

  const isNextMonthDisabled = () => {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    return selectedMonth >= currentMonth;
  };

  return (
    <div className={styles.container}>
      <div className={styles.chartHeader}>
        <IconButton
          onClick={onPreviousMonth}
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
          onClick={onNextMonth}
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
            datasets: chartData.datasets,
          }}
          options={{
            scales: {
              x: {
                display: true,
              },
              y: {
                beginAtZero: true,
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
              tooltip: {
                callbacks: {
                  label: (context: any) => {
                    const index = context.dataIndex;
                    const date = chartData.labels[index];
                    const weight = context.parsed.y;
                    return `${date}: ${weight} kg`;
                  },
                },
              },
            },
            maintainAspectRatio: false,
            onClick: handleDataPointClick,
          }}
        />
      </div>
    </div>
  );
};

export default WeightChart;
