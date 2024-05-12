import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  CircularProgress,
  Divider,
} from "@material-ui/core";

import styles from "./Profile.module.css";
import { useEffect, useState } from "react";
import {
  fetchAsyncGetProf,
  fetchAsyncUpdateProf,
  fetchAsyncAddWeightHistory,
  fetchAsyncAddBodyFatPercentageHistory,
  fetchAsyncAddMuscleMassHistory,
  fetchAsyncListWeightHistory,
  fetchAsyncListBodyFatPercentageHistory,
  fetchAsyncListMuscleMassHistory,
} from "../api/profileApi";
import { fetchAsyncGetUserPosts } from "../api/postApi";
import { AppDispatch } from "../../app/store";
import WeightChart from "../components/graph/profile_graph/WeightChart";
import BodyFatPercentageChart from "../components/graph/profile_graph/BodyFatPercentageChart";
import MuscleMassChart from "../components/graph/profile_graph/MuscleMassChart";
import { getMax, getMin } from "../components/graph/chartUtils";
import ProfileCard from "../components/ProfileCard";

const Profile = () => {
  const dispatch: AppDispatch = useDispatch();
  const profileId = useSelector((state: RootState) => state.profile.profile.id);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const isLoading = useSelector(
    (state: RootState) => state.profile.isLoadingProfile
  );
  const weightHistory = useSelector(
    (state: RootState) => state.profile.weightHistory
  );
  const bodyFatPercentageHistory = useSelector(
    (state: RootState) => state.profile.bodyFatPercentageHistory
  );
  const muscleMassHistory = useSelector(
    (state: RootState) => state.profile.muscleMassHistory
  );

  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [weight, setWeight] = useState("");
  const [bodyFatPercentage, setBodyFatPercentage] = useState("");
  const [muscleMass, setMuscleMass] = useState("");
  const [selectedWeightMonth, setSelectedWeightMonth] = useState(new Date());
  const [selectedBodyFatPercentageMonth, setSelectedBodyFatPercentageMonth] =
    useState(new Date());
  const [selectedMuscleMassMonth, setSelectedMuscleMassMonth] = useState(
    new Date()
  );
  // 過去データの最大値を取得
  const [maxWeight, setMaxWeight] = useState(0);
  const [maxBodyFatPercentage, setMaxBodyFatPercentage] = useState(0);
  const [maxMuscleMass, setMaxMuscleMass] = useState(0);
  // 過去データの最小値を取得
  const [minWeight, setMinWeight] = useState(0);
  const [minBodyFatPercentage, setMinBodyFatPercentage] = useState(0);
  const [minMuscleMass, setMinMuscleMass] = useState(0);

  useEffect(() => {
    if (profileId) {
      dispatch(fetchAsyncGetProf());
      dispatch(fetchAsyncGetUserPosts(profileId));
      dispatch(fetchAsyncListWeightHistory());
      dispatch(fetchAsyncListBodyFatPercentageHistory());
      dispatch(fetchAsyncListMuscleMassHistory());
    }
  }, [profileId, dispatch]);

  useEffect(() => {
    setUpdatedProfile(profile);
  }, [profile]);

  useEffect(() => {
    setMaxWeight(getMax(weightHistory));
    setMinWeight(getMin(weightHistory));
  }, [weightHistory]);

  useEffect(() => {
    setMaxBodyFatPercentage(getMax(bodyFatPercentageHistory));
    setMinBodyFatPercentage(getMin(bodyFatPercentageHistory));
  }, [bodyFatPercentageHistory]);

  useEffect(() => {
    setMaxMuscleMass(getMax(muscleMassHistory));
    setMinMuscleMass(getMin(muscleMassHistory));
  }, [muscleMassHistory]);

  const handleInputChange = (
    event: React.ChangeEvent<{ name: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleGenderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const gender = event.target.value as string;
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      gender,
    }));
  };

  const handleSaveProfile = () => {
    dispatch(fetchAsyncUpdateProf(updatedProfile));
    setEditMode(false);
  };

  const handleAddWeightHistory = () => {
    if (weight) {
      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0];
      dispatch(
        fetchAsyncAddWeightHistory({
          weight: parseFloat(weight),
          date: formattedDate,
        })
      );
      setWeight("");
    }
  };

  const handleAddBodyFatPercentageHistory = () => {
    if (bodyFatPercentage) {
      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0];
      dispatch(
        fetchAsyncAddBodyFatPercentageHistory({
          bodyFatPercentage: parseFloat(bodyFatPercentage),
          date: formattedDate,
        })
      );
      setBodyFatPercentage("");
    }
  };

  const handleAddMuscleMassHistory = () => {
    if (muscleMass) {
      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0];
      dispatch(
        fetchAsyncAddMuscleMassHistory({
          muscleMass: parseFloat(muscleMass),
          date: formattedDate,
        })
      );
      setMuscleMass("");
    }
  };

  const getOldestWeightMonth = () => {
    const allDates = [...weightHistory.map((item) => new Date(item.date))];
    return allDates.length > 0
      ? new Date(Math.min(...allDates.map((date) => date.getTime())))
      : null;
  };

  const getLatestWeightMonth = () => {
    const allDates = [...weightHistory.map((item) => new Date(item.date))];
    return allDates.length > 0
      ? new Date(Math.max(...allDates.map((date) => date.getTime())))
      : null;
  };

  const handlePreviousWeightMonth = () => {
    setSelectedWeightMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextWeightMonth = () => {
    setSelectedWeightMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const getOldestBodyFatPercentageMonth = () => {
    const allDates = [
      ...bodyFatPercentageHistory.map((item) => new Date(item.date)),
    ];
    return allDates.length > 0
      ? new Date(Math.min(...allDates.map((date) => date.getTime())))
      : null;
  };

  const getLatestBodyFatPercentageMonth = () => {
    const allDates = [
      ...bodyFatPercentageHistory.map((item) => new Date(item.date)),
    ];
    return allDates.length > 0
      ? new Date(Math.max(...allDates.map((date) => date.getTime())))
      : null;
  };

  const handlePreviousBodyFatPercentageMonth = () => {
    setSelectedBodyFatPercentageMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextBodyFatPercentageMonth = () => {
    setSelectedBodyFatPercentageMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const getOldestMuscleMassMonth = () => {
    const allDates = [...muscleMassHistory.map((item) => new Date(item.date))];
    return allDates.length > 0
      ? new Date(Math.min(...allDates.map((date) => date.getTime())))
      : null;
  };

  const getLatestMuscleMassMonth = () => {
    const allDates = [...muscleMassHistory.map((item) => new Date(item.date))];
    return allDates.length > 0
      ? new Date(Math.max(...allDates.map((date) => date.getTime())))
      : null;
  };

  const handlePreviousMuscleMassMonth = () => {
    setSelectedMuscleMassMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMuscleMassMonth = () => {
    setSelectedMuscleMassMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const isPreviousWeightMonthDisabled = () => {
    const oldestMonth = getOldestWeightMonth();
    return (
      !oldestMonth ||
      (oldestMonth.getFullYear() >= selectedWeightMonth.getFullYear() &&
        oldestMonth.getMonth() >= selectedWeightMonth.getMonth())
    );
  };

  const isNextWeightMonthDisabled = () => {
    const latestMonth = getLatestWeightMonth();
    return (
      !latestMonth ||
      (latestMonth.getFullYear() <= selectedWeightMonth.getFullYear() &&
        latestMonth.getMonth() <= selectedWeightMonth.getMonth())
    );
  };

  const isPreviousBodyFatPercentageMonthDisabled = () => {
    const oldestMonth = getOldestBodyFatPercentageMonth();
    return (
      !oldestMonth ||
      (oldestMonth.getFullYear() >=
        selectedBodyFatPercentageMonth.getFullYear() &&
        oldestMonth.getMonth() >= selectedBodyFatPercentageMonth.getMonth())
    );
  };

  const isNextBodyFatPercentageMonthDisabled = () => {
    const latestMonth = getLatestBodyFatPercentageMonth();
    return (
      !latestMonth ||
      (latestMonth.getFullYear() <=
        selectedBodyFatPercentageMonth.getFullYear() &&
        latestMonth.getMonth() <= selectedBodyFatPercentageMonth.getMonth())
    );
  };

  const isPreviousMuscleMassMonthDisabled = () => {
    const oldestMonth = getOldestMuscleMassMonth();
    return (
      !oldestMonth ||
      (oldestMonth.getFullYear() >= selectedMuscleMassMonth.getFullYear() &&
        oldestMonth.getMonth() >= selectedMuscleMassMonth.getMonth())
    );
  };

  const isNextMuscleMassMonthDisabled = () => {
    const latestMonth = getLatestMuscleMassMonth();
    return (
      !latestMonth ||
      (latestMonth.getFullYear() <= selectedMuscleMassMonth.getFullYear() &&
        latestMonth.getMonth() <= selectedMuscleMassMonth.getMonth())
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className={styles.profileContainer}>
      {updatedProfile?.id && (
        <>
          <ProfileCard />
          <Divider className={styles.divider} />
          <Card className={styles.chartCard}>
            <CardContent>
              <div className={styles.graphHeader}>
                <Typography
                  variant="h5"
                  component="h2"
                  className={styles.graphTitle}
                  gutterBottom
                >
                  体重推移
                </Typography>
              </div>
              <div className={styles.historyContainer}>
                <WeightChart
                  weightHistory={weightHistory}
                  selectedMonth={selectedWeightMonth}
                  onPreviousMonth={handlePreviousWeightMonth}
                  onNextMonth={handleNextWeightMonth}
                  isPreviousMonthDisabled={isPreviousWeightMonthDisabled()}
                  isNextMonthDisabled={isNextWeightMonthDisabled()}
                  maxWeight={maxWeight}
                  minWeight={minWeight}
                />
              </div>
              <div className={styles.inputContainer}>
                <TextField
                  label="体重"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  InputProps={{
                    inputProps: { min: 0, step: "0.01" },
                    endAdornment: <Typography>kg</Typography>,
                  }}
                  variant="outlined"
                  fullWidth
                  className={styles.inputField}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddWeightHistory}
                  className={styles.recordButton}
                >
                  記録
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={styles.chartCard}>
            <CardContent>
              <div className={styles.graphHeader}>
                <Typography
                  variant="h5"
                  component="h2"
                  className={styles.graphTitle}
                  gutterBottom
                >
                  体脂肪率推移
                </Typography>
              </div>
              <div className={styles.historyContainer}>
                <BodyFatPercentageChart
                  bodyFatPercentageHistory={bodyFatPercentageHistory}
                  selectedMonth={selectedBodyFatPercentageMonth}
                  onPreviousMonth={handlePreviousBodyFatPercentageMonth}
                  onNextMonth={handleNextBodyFatPercentageMonth}
                  isPreviousMonthDisabled={isPreviousBodyFatPercentageMonthDisabled()}
                  isNextMonthDisabled={isNextBodyFatPercentageMonthDisabled()}
                  maxBodyFatPercentage={maxBodyFatPercentage}
                  minBodyFatPercentage={minBodyFatPercentage}
                />
              </div>
              <div className={styles.inputContainer}>
                <TextField
                  label="体脂肪率"
                  type="number"
                  value={bodyFatPercentage}
                  onChange={(e) => setBodyFatPercentage(e.target.value)}
                  InputProps={{
                    inputProps: { min: 0, step: "0.01" },
                    endAdornment: <Typography>%</Typography>,
                  }}
                  variant="outlined"
                  fullWidth
                  className={styles.inputField}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddBodyFatPercentageHistory}
                  className={styles.recordButton}
                >
                  記録
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={styles.chartCard}>
            <CardContent>
              <div className={styles.graphHeader}>
                <Typography
                  variant="h5"
                  component="h2"
                  className={styles.graphTitle}
                  gutterBottom
                >
                  筋肉量推移
                </Typography>
              </div>
              <div className={styles.historyContainer}>
                <MuscleMassChart
                  muscleMassHistory={muscleMassHistory}
                  selectedMonth={selectedMuscleMassMonth}
                  onPreviousMonth={handlePreviousMuscleMassMonth}
                  onNextMonth={handleNextMuscleMassMonth}
                  isPreviousMonthDisabled={isPreviousMuscleMassMonthDisabled()}
                  isNextMonthDisabled={isNextMuscleMassMonthDisabled()}
                  maxMuscleMass={maxMuscleMass}
                  minMuscleMass={minMuscleMass}
                />
              </div>
              <div className={styles.inputContainer}>
                <TextField
                  label="筋肉量"
                  type="number"
                  value={muscleMass}
                  onChange={(e) => setMuscleMass(e.target.value)}
                  InputProps={{
                    inputProps: { min: 0, step: "0.01" },
                    endAdornment: <Typography>kg</Typography>,
                  }}
                  variant="outlined"
                  fullWidth
                  className={styles.inputField}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddMuscleMassHistory}
                  className={styles.recordButton}
                >
                  記録
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Profile;
