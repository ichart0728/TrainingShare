import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import "chartjs-adapter-date-fns";
import styles from "./WorkoutHistory.module.css";
import { fetchAsyncGetTrainingSessions } from "../api/workoutApi";
import { AppDispatch } from "../../app/store";
import { Grid, Tabs, Tab, Typography } from "@material-ui/core";
import LineChartComponent from "../components/graph/training_graph/LineChartComponent";
import PieChartComponent from "../components/graph/training_graph/PieChartComponent";
import RadarChartComponent from "../components/graph/training_graph/RadarChartComponent";
import WeeklyTrainingFrequencyChart from "../components/graph/training_graph/WeeklyTrainingFrequencyChart";

const bodyPartColors: { [key: number]: string } = {
  1: "#3498DB",
  2: "#2ECC71",
  3: "#F39C12",
  4: "#1ABC9C",
  5: "#9B59B6",
  6: "#34495E",
};

const WorkoutHistory = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedTab, setSelectedTab] = React.useState(0);

  useEffect(() => {
    dispatch(fetchAsyncGetTrainingSessions());
  }, [dispatch]);

  const trainingSessions = useSelector(
    (state: RootState) => state.workoutHistory.trainingSessions
  );
  const trainingMenus = useSelector(
    (state: RootState) => state.training.trainingMenus
  );

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div className={styles.historyContainer}>
      <div className={styles.container}>
        <Grid container spacing={4}>
          <Grid item xs={12} className={styles.gridContainer}>
            <div className={styles.chartWrapper}>
              <div className={styles.chartHeader}>
                <Typography variant="h6" className={styles.chartTitle}>
                  トレーニングボリューム遷移
                </Typography>
              </div>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                aria-label="body part tabs"
                variant="scrollable"
                scrollButtons="on"
                className={styles.tabsContainer}
              >
                <Tab label="すべて" className={styles.tab} />
                {trainingMenus.map((part) => (
                  <Tab label={part.name} key={part.id} className={styles.tab} />
                ))}
              </Tabs>
              <div className={styles.chartContainer}>
                <LineChartComponent
                  trainingSessions={trainingSessions}
                  trainingMenus={trainingMenus}
                  bodyPartColors={bodyPartColors}
                  selectedTab={selectedTab}
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={6} className={styles.gridContainer}>
            <div className={styles.chartWrapper}>
              <div className={styles.chartHeader}>
                <Typography variant="h6" className={styles.chartTitle}>
                  部位別トレーニング分布
                </Typography>
              </div>
              <div className={styles.chartContainer}>
                <PieChartComponent
                  trainingSessions={trainingSessions}
                  trainingMenus={trainingMenus}
                  bodyPartColors={bodyPartColors}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6} className={styles.gridContainer}>
            <div className={styles.chartWrapper}>
              <div className={styles.chartHeader}>
                <Typography variant="h6" className={styles.chartTitle}>
                  トレーニングバランス
                </Typography>
              </div>
              <div className={styles.chartContainer}>
                <RadarChartComponent
                  trainingSessions={trainingSessions}
                  trainingMenus={trainingMenus}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} className={styles.gridContainer}>
            <div className={styles.chartWrapper}>
              <div className={styles.chartHeader}>
                <Typography variant="h6" className={styles.chartTitle}>
                  曜日別トレーニング回数
                </Typography>
              </div>
              <div className={styles.chartContainer}>
                <WeeklyTrainingFrequencyChart
                  trainingSessions={trainingSessions}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default WorkoutHistory;
