import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { IconButton } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import styles from "./BodyPartChart.module.css";
import {
  PROPS_RADAR_CHART,
  PROPS_TRAINING_SESSION,
  PROPS_TRAINING_MENU,
} from "../../types";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  ChartDataLabels,
  Filler,
  Tooltip,
  Legend
);

const RadarChartComponent: React.FC<PROPS_RADAR_CHART> = ({
  trainingSessions,
  trainingMenus,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [chartData, setChartData] = useState<any>({
    labels: trainingMenus.map((menu) => menu.name),
    datasets: [
      {
        label: "対象月のトレーニング頻度",
        backgroundColor: "rgba(34, 202, 236, 0.2)",
        borderColor: "rgba(34, 202, 236, 1)",
        pointBackgroundColor: "rgba(34, 202, 236, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(34, 202, 236, 1)",
        data: Array(trainingMenus.length).fill(0),
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

    const filteredSessions = trainingSessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= monthStart && sessionDate <= monthEnd;
    });

    const frequencyData = calculateTrainingFrequency(
      trainingMenus,
      filteredSessions
    );

    const hasData = frequencyData.some((item) => item.value !== 0);
    const maxValue = Math.max(...frequencyData.map((item) => item.value), 10);

    const data = {
      labels: trainingMenus.map((menu) => menu.name),
      datasets: [
        {
          label: "対象月のトレーニング頻度",
          backgroundColor: "rgba(34, 202, 236, 0.2)",
          borderColor: "rgba(34, 202, 236, 1)",
          pointBackgroundColor: "rgba(34, 202, 236, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(34, 202, 236, 1)",
          data: hasData
            ? frequencyData.map((item) => item.value)
            : Array(trainingMenus.length).fill(0),
        },
      ],
    };

    setChartData({ data, maxValue });
  }, [selectedMonth, trainingSessions, trainingMenus]);

  const getStepSize = (maxValue: number) => {
    if (maxValue <= 10) {
      return 1;
    } else if (maxValue <= 50) {
      return 5;
    } else {
      return 10;
    }
  };

  const options = {
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      r: {
        min: 0,
        max: chartData.maxValue,
        ticks: {
          stepSize: getStepSize(chartData.maxValue),
          backdropColor: "transparent",
        },
        angleLines: {
          display: false,
        },
        pointLabels: {
          font: {
            size: 14,
          },
        },
        gridLines: {
          circular: true,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
    maintainAspectRatio: false,
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
        {chartData.data && <Radar data={chartData.data} options={options} />}
      </div>
    </div>
  );
};

function calculateTrainingFrequency(
  trainingMenus: PROPS_TRAINING_MENU[],
  trainingSessions: PROPS_TRAINING_SESSION[]
) {
  return trainingMenus.map((menu) => ({
    name: menu.name,
    value: trainingSessions.reduce((count, session) => {
      return (
        count +
        session.workouts.filter(
          (workout) => Number(workout.body_part) === menu.id
        ).length
      );
    }, 0),
  }));
}

export default RadarChartComponent;
