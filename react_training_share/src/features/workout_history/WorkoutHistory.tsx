import React, { ChangeEvent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Line } from "react-chartjs-2";
import { Tabs, Tab } from "@material-ui/core";
import { fetchAsyncGetTrainingSessions } from "../api/workoutApi";
import { RootState } from "../../app/store";
import styles from "./WorkoutHistory.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip
);

const bodyPartColors: { [key: number]: string } = {
  1: "#FF6384",
  2: "#36A2EB",
  3: "#FFCE56",
  4: "#4BC0C0",
  5: "#9966FF",
  6: "#FF9F40",
};

interface DataSet {
  label: string;
  data: { x: string; y: number }[];
  borderColor: string;
  fill: boolean;
}

interface ChartData {
  labels: string[];
  datasets: DataSet[];
}

const WorkoutHistory = () => {
  const dispatch = useDispatch();
  const trainingSessions = useSelector(
    (state: RootState) => state.workoutHistory.trainingSessions
  );
  const trainingMenus = useSelector(
    (state: RootState) => state.training.trainingMenus
  );
  const [selectedTab, setSelectedTab] = useState(0);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    dispatch(fetchAsyncGetTrainingSessions() as any);
  }, [dispatch]);

  useEffect(() => {
    const labels = trainingSessions.map(
      (session) => new Date(session.date).toISOString().split("T")[0]
    );
    const datasets = trainingMenus.map((part) => ({
      label: part.name,
      data: trainingSessions.map((session) => ({
        x: session.date,
        y: session.workouts
          .filter((workout) => Number(workout.body_part) === part.id)
          .reduce(
            (acc, workout) =>
              acc +
              workout.sets.reduce(
                (accSet, set) => accSet + set.weight * set.reps,
                0
              ),
            0
          ),
      })),
      borderColor: bodyPartColors[part.id],
      backgroundColor: bodyPartColors[part.id],
      fill: false,
    }));

    setChartData({ labels, datasets });
  }, [trainingSessions, trainingMenus]);

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="body part tabs"
      >
        <Tab label="すべて" />
        {trainingMenus.map((part, index) => (
          <Tab label={part.name} key={part.id} />
        ))}
      </Tabs>
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
                time: { unit: "day", displayFormats: { day: "yyyy-MM-dd" } },
              },
              y: { beginAtZero: true },
            },
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
};

export default WorkoutHistory;
