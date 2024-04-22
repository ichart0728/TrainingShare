// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Line } from "react-chartjs-2";
// import { ChartData, ChartOptions } from "chart.js";
// import { fetchAsyncGetTrainingSessions } from "../api/workoutApi";
// import { RootState } from "../../app/store";
// import styles from "./WorkoutHistory.module.css";
// import "chartjs-adapter-date-fns";

const WorkoutHistory = () => {
  //   const dispatch = useDispatch();
  //   const trainingSessions = useSelector(
  //     (state: RootState) => state.workoutHistory.trainingSessions
  //   );
  //   const [chartData, setChartData] = useState<ChartData<"line">>({
  //     labels: [],
  //     datasets: [],
  //   });
  //   const chartOptions: ChartOptions<"line"> = {
  //     scales: {
  //       x: {
  //         type: "time",
  //         time: {
  //           unit: "day",
  //           displayFormats: {
  //             day: "yyyy-MM-dd",
  //           },
  //         },
  //       },
  //       y: {
  //         beginAtZero: true,
  //       },
  //     },
  //   };
  //   useEffect(() => {
  //     dispatch(fetchAsyncGetTrainingSessions() as any);
  //   }, [dispatch]);
  //   useEffect(() => {
  //     const dates = trainingSessions.map((session) => new Date(session.date));
  //     const volumes = trainingSessions.map((session) => {
  //       return session.workouts.reduce((total, workout) => {
  //         return (
  //           total +
  //           workout.sets.reduce((setTotal, set) => {
  //             return setTotal + set.weight * set.reps;
  //           }, 0)
  //         );
  //       }, 0);
  //     });
  //     setChartData({
  //       labels: dates,
  //       datasets: [
  //         {
  //           label: "Training Volume",
  //           data: volumes,
  //           fill: false,
  //           backgroundColor: "rgba(75,192,192,0.4)",
  //           borderColor: "rgba(75,192,192,1)",
  //         },
  //       ],
  //     });
  //   }, [trainingSessions]);
  //   return (
  //     <div className={styles.container}>
  //       <h2>Workout History</h2>
  //       <div className={styles.chartContainer}>
  //         <Line data={chartData} options={chartOptions} />
  //       </div>
  //     </div>
  //   );
};

export default WorkoutHistory;
