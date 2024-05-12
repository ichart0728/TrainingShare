import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { PROPS_TRAINING_SESSION } from "../../types";
import styles from "./BodyPartChart.module.css";
import { IconButton } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface WeeklyTrainingFrequencyChartProps {
  trainingSessions: PROPS_TRAINING_SESSION[];
}

const WeeklyTrainingFrequencyChart: React.FC<
  WeeklyTrainingFrequencyChartProps
> = ({ trainingSessions }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [chartData, setChartData] = useState<any>({
    labels: ["日", "月", "火", "水", "木", "金", "土"],
    datasets: [
      {
        data: Array(7).fill(0),
        backgroundColor: Array(7).fill("rgba(200, 200, 200, 0.6)"),
        borderColor: Array(7).fill("rgba(200, 200, 200, 1)"),
        borderWidth: 1,
      },
    ],
  });

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

  useEffect(() => {
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

    const weeklyData = Array(7).fill(0);
    trainingSessions.forEach((session) => {
      const sessionDate = new Date(session.date);
      if (sessionDate >= monthStart && sessionDate <= monthEnd) {
        const dayOfWeek = sessionDate.getDay();
        weeklyData[dayOfWeek]++;
      }
    });

    const data = {
      labels: ["日", "月", "火", "水", "木", "金", "土"],
      datasets: [
        {
          data: weeklyData,
          backgroundColor: weeklyData.map((_, index) =>
            index === weeklyData.indexOf(Math.max(...weeklyData))
              ? "rgba(54, 162, 235, 0.6)"
              : "rgba(200, 200, 200, 0.6)"
          ),
          borderColor: weeklyData.map((_, index) =>
            index === weeklyData.indexOf(Math.max(...weeklyData))
              ? "rgba(54, 162, 235, 1)"
              : "rgba(200, 200, 200, 1)"
          ),
          borderWidth: 1,
        },
      ],
    };

    setChartData(data);
  }, [selectedMonth, trainingSessions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

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
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WeeklyTrainingFrequencyChart;
