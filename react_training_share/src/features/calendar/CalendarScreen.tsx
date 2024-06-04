import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { RootState } from "../../app/store";
import WorkoutItemView from "../components/WorkoutItemView";
import SelectTrainingSessionModal from "../components/modal/SelectTrainingSessionModal";
import { PROPS_TRAINING_SESSION, PROPS_TRAINING } from "../types";
import { Button, Typography } from "@material-ui/core";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { fetchAsyncDeleteTrainingSession } from "../api/workoutApi";
import { AppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";

import styles from "./CalendarScreen.module.css";
import { isFuture } from "date-fns";

const localizer = momentLocalizer(moment);

const CalendarScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const trainingSessions = useSelector(
    (state: RootState) => state.workoutHistory.trainingSessions
  );
  const trainings = useSelector(
    (state: RootState) => state.training.trainingMenus
  );
  const [selectedSession, setSelectedSession] =
    useState<PROPS_TRAINING_SESSION | null>(null);
  const [openSessionList, setOpenSessionList] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletedWorkoutId, setDeletedWorkoutId] = useState<string | null>(null);
  const [selectedSlotDate, setSelectedSlotDate] = useState<Date | null>(null);

  useEffect(() => {
    if (selectedSession) {
      const updatedSession = trainingSessions.find(
        (session) => session.id === selectedSession.id
      );
      if (updatedSession) {
        setSelectedSession(updatedSession);
      } else {
        setSelectedSession(null);
      }
    }
  }, [trainingSessions, selectedSession]);

  const getTrainingTitle = (
    session: PROPS_TRAINING_SESSION,
    trainings: PROPS_TRAINING[]
  ) => {
    const bodyParts = session.workouts.map((workout) => {
      const training = trainings.find((t) => t.id === workout.body_part);
      return training ? training.name : "";
    });
    const uniqueBodyParts = Array.from(new Set(bodyParts));
    return uniqueBodyParts.join(", ");
  };

  const events = trainingSessions.map((session) => ({
    start: new Date(session.date),
    end: new Date(session.date),
    title: getTrainingTitle(session, trainings),
    session: session,
  }));

  const handleSelectEvent = (event: any) => {
    setSelectedSession(event.session);
    setSelectedSlotDate(null);
  };

  const handleCloseSessionList = () => {
    setOpenSessionList(false);
  };

  const handleSelectSessionFromList = (session: PROPS_TRAINING_SESSION) => {
    setSelectedSession(session);
    setOpenSessionList(false);
  };

  const handleShowMore = (events: any[], date: Date) => {
    setSelectedDate(date);
    setOpenSessionList(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  const handleDeleteSession = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedSession) {
      await dispatch(
        fetchAsyncDeleteTrainingSession({
          TrainingSessionId: selectedSession.id,
        })
      );
      setSelectedSession(null);
    }
    setOpenDeleteModal(false);
  };

  const handleSelectSlot = (slotInfo: any) => {
    const selectedDate = moment(slotInfo.start).tz("Asia/Tokyo").toDate();
    setSelectedSlotDate(selectedDate);
    setSelectedSession(null);
  };

  const eventStyleGetter = (event: any) => {
    const isSelected =
      selectedSession && event.session.id === selectedSession.id;
    const backgroundColor = isSelected ? "#ff6b6b" : "#3174ad";
    return {
      style: {
        backgroundColor,
        color: "#ffffff",
        borderRadius: "5px",
        border: "none",
      },
    };
  };

  const slotStyleGetter = (date: Date) => {
    const isSelected =
      selectedSlotDate && moment(date).isSame(selectedSlotDate, "day");
    const backgroundColor = isSelected ? "#4ecdc4" : undefined;
    return {
      style: {
        backgroundColor,
      },
    };
  };

  const dayStyleGetter = (date: Date) => {
    const isSelected =
      selectedSlotDate && moment(date).isSame(selectedSlotDate, "day");
    const backgroundColor = isSelected ? "#ffd6d6" : undefined;
    return {
      style: {
        backgroundColor,
      },
    };
  };

  const isSelectedSlotToday = () => {
    if (selectedSlotDate) {
      const today = moment().tz("Asia/Tokyo").startOf("day").toDate();
      return moment(selectedSlotDate).isSame(today, "day");
    }
    return false;
  };

  // 選択した日付が未来の日付の場合はTrueを返す
  const isSelectedSlotTodayOrFuture = () => {
    if (selectedSlotDate) {
      const today = moment().tz("Asia/Tokyo").startOf("day").toDate();
      return moment(selectedSlotDate).isSameOrAfter(today, "day");
    }
    return false;
  };

  const handleMakeTrainingPlan = (isPlan: boolean) => {
    navigate("/workout", {
      state: {
        isPlan: isPlan ? false : true,
        selectedDate: selectedSlotDate,
      },
    });
  };

  const renderTrainingContainer = () => {
    if (selectedSession && selectedSession.workouts.length > 0) {
      return (
        <>
          <h3>{formatDate(selectedSession.date)}</h3>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteSession}
          >
            トレーニングセッションを削除
          </Button>
          {selectedSession.workouts
            .filter((workout) => workout.id !== deletedWorkoutId)
            .map((workout, index) => (
              <div key={workout.id} className={styles.workoutItem}>
                <WorkoutItemView
                  workout={workout}
                  trainingSession={selectedSession}
                  onDelete={(workoutId) => setDeletedWorkoutId(workoutId)}
                />
              </div>
            ))}
        </>
      );
    } else if (selectedSlotDate) {
      const sessionsOnSelectedDate = trainingSessions.filter((session) =>
        moment(session.date).isSame(selectedSlotDate, "day")
      );

      if (sessionsOnSelectedDate.length > 0) {
        return (
          <>
            <h3>{formatDate(selectedSlotDate.toString())}</h3>
            {sessionsOnSelectedDate.map((session, index) => (
              <div key={session.id} className={styles.workoutItem}>
                {session.workouts.map((workout) => (
                  <WorkoutItemView
                    key={workout.id}
                    workout={workout}
                    trainingSession={session}
                    onDelete={(workoutId) => setDeletedWorkoutId(workoutId)}
                  />
                ))}
              </div>
            ))}
          </>
        );
      } else if (isSelectedSlotTodayOrFuture()) {
        return (
          <>
            <h3>{formatDate(selectedSlotDate.toString())}</h3>
            {isSelectedSlotToday() && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleMakeTrainingPlan(isSelectedSlotToday())}
              >
                本日のトレーニングを開始する
              </Button>
            )}
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => handleMakeTrainingPlan(isSelectedSlotToday())}
            >
              本日のトレーニングを開始する
            </Button> */}
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => handleMakeTrainingPlan(isSelectedSlotToday())}
            >
              {isSelectedSlotToday()
                ? "本日のトレーニングを開始する"
                : "トレーニングプランを立てる"}
            </Button> */}
          </>
        );
      } else {
        return (
          <>
            <h3>{formatDate(selectedSlotDate.toString())}</h3>
            <Typography variant="body1">
              トレーニングデータがありません
            </Typography>
          </>
        );
      }
    }

    return null;
  };

  return (
    <div>
      <div style={{ height: "500px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          views={["month"]}
          onSelectEvent={handleSelectEvent}
          onShowMore={handleShowMore}
          selectable
          onSelectSlot={handleSelectSlot}
          longPressThreshold={1}
          eventPropGetter={eventStyleGetter}
          slotPropGetter={slotStyleGetter}
          dayPropGetter={dayStyleGetter}
        />
      </div>
      <div className={styles.TrainingContainer}>
        {renderTrainingContainer()}
      </div>
      <SelectTrainingSessionModal
        open={openSessionList}
        onClose={handleCloseSessionList}
        selectedDate={selectedDate}
        onSelectSession={handleSelectSessionFromList}
      />
      <ConfirmationDialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="トレーニングセッションの削除"
        content="このアクションは元に戻せません。本当に削除しますか？"
        cancelText="キャンセル"
        confirmText="削除"
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CalendarScreen;
