import React from "react";
import { Line } from "react-chartjs-2";
import styles from "./BodyFatPercentageChart.module.css";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  ChartDataLabels,
  Tooltip
);

interface BodyFatPercentageChartProps {
  bodyFatPercentageHistory: { bodyFatPercentage: number; date: string }[];
}

const BodyFatPercentageChart: React.FC<BodyFatPercentageChartProps> = ({
  bodyFatPercentageHistory,
}) => {
  const calculateChartData = () => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const labels: string[] = [];
    for (let d = oneMonthAgo; d <= today; d.setDate(d.getDate() + 1)) {
      labels.push(new Date(d).toISOString().split("T")[0]);
    }

    const BodyFatPercentageData = labels.map((label) => {
      const data = bodyFatPercentageHistory.find((item) => item.date === label);
      return data ? data.bodyFatPercentage : null;
    });

    return {
      labels,
      datasets: [
        {
          data: BodyFatPercentageData,
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
    <div className={styles.chartContainer}>
      <Line
        data={{
          labels: chartData.labels,
          datasets: chartData.datasets,
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
              display: false,
            },
          },
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default BodyFatPercentageChart;
