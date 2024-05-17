import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { RootState } from "../../app/store";
import WorkoutItemView from "../components/WorkoutItemView";
import SelectTrainingSessionModal from "../components/modal/SelectTrainingSessionModal";
import { PROPS_TRAINING_SESSION, Training } from "../types";
import { Button } from "@material-ui/core";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { fetchAsyncDeleteTrainingSession } from "../api/workoutApi";
import { AppDispatch } from "../../app/store";
import styles from "./CalendarScreen.module.css";

const localizer = momentLocalizer(moment);

const CalendarScreen = () => {
  const dispatch: AppDispatch = useDispatch();
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

  const getTrainingTitle = (
    session: PROPS_TRAINING_SESSION,
    trainings: Training[]
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
          eventPropGetter={() => ({
            style: {
              backgroundColor: "#3174ad",
              color: "#ffffff",
              borderRadius: "5px",
              border: "none",
            },
          })}
        />
      </div>
      {selectedSession && (
        <div className={styles.TrainingContainer}>
          <h3>{formatDate(selectedSession.date)}のトレーニング内容</h3>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteSession}
          >
            トレーニングセッションを削除
          </Button>
          {selectedSession.workouts.map((workout) => (
            <WorkoutItemView
              key={workout.id}
              workout={workout}
              trainingSession={selectedSession}
            />
          ))}{" "}
        </div>
      )}
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
