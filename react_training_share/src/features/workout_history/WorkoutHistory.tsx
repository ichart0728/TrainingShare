// WorkoutHistory.tsx
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import "chartjs-adapter-date-fns";
import BodyPartChart from "../components/graph/BodyPartChart";
import styles from "./WorkoutHistory.module.css";
import { fetchAsyncGetTrainingSessions } from "../api/workoutApi";
import { AppDispatch } from "../../app/store";

const WorkoutHistory = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    dispatch(fetchAsyncGetTrainingSessions());
  }, [dispatch]);

  const trainingSessions = useSelector(
    (state: RootState) => state.workoutHistory.trainingSessions
  );
  const trainingMenus = useSelector(
    (state: RootState) => state.training.trainingMenus
  );

  const getOldestMonth = () => {
    const allDates = trainingSessions.map((session) => new Date(session.date));
    return allDates.length > 0
      ? new Date(Math.min(...allDates.map((date) => date.getTime())))
      : null;
  };

  const getLatestMonth = () => {
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
    const oldestMonth = getOldestMonth();
    return (
      !oldestMonth ||
      (oldestMonth.getFullYear() >= selectedMonth.getFullYear() &&
        oldestMonth.getMonth() >= selectedMonth.getMonth())
    );
  };

  const isNextMonthDisabled = () => {
    const latestMonth = getLatestMonth();
    return (
      !latestMonth ||
      (latestMonth.getFullYear() <= selectedMonth.getFullYear() &&
        latestMonth.getMonth() <= selectedMonth.getMonth())
    );
  };

  return (
    <div className={styles.historyContainer}>
      <BodyPartChart
        trainingSessions={trainingSessions}
        trainingMenus={trainingMenus}
        selectedMonth={selectedMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        isPreviousMonthDisabled={isPreviousMonthDisabled()}
        isNextMonthDisabled={isNextMonthDisabled()}
      />
    </div>
  );
};

export default WorkoutHistory;
