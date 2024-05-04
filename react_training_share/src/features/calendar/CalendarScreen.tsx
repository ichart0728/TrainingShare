import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { RootState } from "../../app/store";
import WorkoutItemView from "../components/WorkoutItemView";
import { PROPS_WORKOUT, PROPS_TRAINING_SESSION, Training } from "../types";

const localizer = momentLocalizer(moment);

const CalendarScreen = () => {
  const trainingSessions = useSelector(
    (state: RootState) => state.workoutHistory.trainingSessions
  );

  const trainings = useSelector(
    (state: RootState) => state.training.trainingMenus
  );

  const [selectedSession, setSelectedSession] =
    useState<PROPS_TRAINING_SESSION | null>(null);

  const getTrainingTitle = (
    session: PROPS_TRAINING_SESSION,
    trainings: Training[]
  ) => {
    const bodyParts = session.workouts.map((workout) => {
      const training = trainings.find((t) => t.id === workout.body_part);
      return training ? training.name : "";
    });
    return bodyParts.join(", ");
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
          eventPropGetter={(event: any) => {
            const sessionCount = trainingSessions.filter((session) =>
              moment(session.date).isSame(event.start, "day")
            ).length;
            return {
              style: {
                backgroundColor: "#3174ad",
                color: "#ffffff",
                borderRadius: "5px",
                border: "none",
              },
              title:
                sessionCount > 1
                  ? `${event.title} +${sessionCount - 1} more`
                  : event.title,
            };
          }}
        />
      </div>
      {selectedSession && (
        <div>
          <h3>トレーニング内容</h3>
          {selectedSession.workouts.map(
            (workout) =>
              // completedがtrueのデータだけ表示
              workout.sets.every((set) => set.completed) && (
                <WorkoutItemView key={workout.id} workout={workout} />
              )
          )}{" "}
        </div>
      )}
    </div>
  );
};

export default CalendarScreen;
