import React from "react";
import { Grid, Tabs, Tab, Typography } from "@material-ui/core";
import styles from "./BodyPartChart.module.css";
import LineChartComponent from "./LineChartComponent";
import PieChartComponent from "./PieChartComponent";
import RadarChartComponent from "./RadarChartComponent";
import WeeklyTrainingFrequencyChart from "./WeeklyTrainingFrequencyChart";

import { PROPS_WORKOUT_CHART } from "../../types";

const bodyPartColors: { [key: number]: string } = {
  1: "#3498DB",
  2: "#2ECC71",
  3: "#F39C12",
  4: "#1ABC9C",
  5: "#9B59B6",
  6: "#34495E",
};

const WorkoutChart: React.FC<PROPS_WORKOUT_CHART> = ({
  trainingSessions,
  trainingMenus,
}) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div className={styles.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className={styles.chartHeader}>
            <Typography variant="h6" className={styles.chartTitle}>
              成長グラフ
            </Typography>
          </div>
          <div className={styles.tabsWrapper}>
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
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={styles.chartContainer}>
            <LineChartComponent
              trainingSessions={trainingSessions}
              trainingMenus={trainingMenus}
              selectedTab={selectedTab}
              bodyPartColors={bodyPartColors}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
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
        </Grid>
        <Grid item xs={12} md={6}>
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
        </Grid>
        <Grid item xs={12} md={12}>
          <div className={styles.chartHeader}>
            <Typography variant="h6" className={styles.chartTitle}>
              曜日別トレーニング回数
            </Typography>
          </div>
          <div className={styles.chartContainer}>
            <WeeklyTrainingFrequencyChart trainingSessions={trainingSessions} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default WorkoutChart;
