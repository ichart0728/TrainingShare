import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import styles from "./BodyPartChart.module.css";

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
  Filler,
  Tooltip,
  Legend
);

interface TrainingSession {
  id: string;
  date: string;
  duration: number;
  workouts: {
    id: string;
    menu: string;
    body_part: string;
    sets: {
      id: string;
      weight: number;
      reps: number;
      completed: boolean;
    }[];
  }[];
}

interface TrainingMenu {
  id: number;
  name: string;
}

interface RadarChartProps {
  trainingSessions: TrainingSession[];
  trainingMenus: TrainingMenu[];
}

const RadarChartComponent: React.FC<RadarChartProps> = ({
  trainingSessions,
  trainingMenus,
}) => {
  const [chartData, setChartData] = useState<any>();

  useEffect(() => {
    const frequencyData = calculateTrainingFrequency(
      trainingMenus,
      trainingSessions
    );
    const data = {
      labels: frequencyData.map((item) => item.name),
      datasets: [
        {
          label: "Training Frequency Last Month",
          backgroundColor: "rgba(34, 202, 236, 0.2)",
          borderColor: "rgba(34, 202, 236, 1)",
          pointBackgroundColor: "rgba(34, 202, 236, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(34, 202, 236, 1)",
          data: frequencyData.map((item) => item.value),
        },
      ],
    };

    setChartData(data);
  }, [trainingSessions, trainingMenus]);

  const options = {
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scale: {
      ticks: {
        beginAtZero: true,
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
    elements: {
      line: {
        borderWidth: 3,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={styles.chartContainer}>
      {chartData && <Radar data={chartData} options={options} />}
    </div>
  );
};

function calculateTrainingFrequency(
  trainingMenus: TrainingMenu[],
  trainingSessions: TrainingSession[]
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
