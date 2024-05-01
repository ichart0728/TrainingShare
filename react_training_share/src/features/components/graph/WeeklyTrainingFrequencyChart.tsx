import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { PROPS_TRAINING_SESSION } from "../../types";
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

  useEffect(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const weeklyData = Array(7).fill(0);
    trainingSessions.forEach((session) => {
      const sessionDate = new Date(session.date);
      if (sessionDate >= oneMonthAgo) {
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
  }, [trainingSessions]);

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
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default WeeklyTrainingFrequencyChart;
