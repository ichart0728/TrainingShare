import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

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
  const [chartData, setChartData] = useState<any>({
    labels: trainingMenus.map((menu) => menu.name),
    datasets: [
      {
        label: "過去1ヶ月のトレーニング頻度",
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

  useEffect(() => {
    const frequencyData = calculateTrainingFrequency(
      trainingMenus,
      trainingSessions
    );

    const hasData = frequencyData.some((item) => item.value !== 0);
    const maxValue = Math.max(...frequencyData.map((item) => item.value), 10);

    const data = {
      labels: trainingMenus.map((menu) => menu.name),
      datasets: [
        {
          label: "過去1ヶ月のセット数",
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
  }, [trainingSessions, trainingMenus]);

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
    <div className={styles.chartContainer}>
      {chartData.data && <Radar data={chartData.data} options={options} />}
    </div>
  );
};

function calculateTrainingFrequency(
  trainingMenus: PROPS_TRAINING_MENU[],
  trainingSessions: PROPS_TRAINING_SESSION[]
) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recentSessions = trainingSessions.filter(
    (session) => new Date(session.date) >= oneMonthAgo
  );

  return trainingMenus.map((menu) => ({
    name: menu.name,
    value: recentSessions.reduce((count, session) => {
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
