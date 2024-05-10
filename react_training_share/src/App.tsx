import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";

import Sidebar from "./features/components/Sidebar";
import Auth from "./features/auth/Auth";
import Home from "./features/home/Home";
import Workout from "./features/workout/Workout";
import Profile from "./features/profile/Profile";
import WorkoutHistory from "./features/workout_history/WorkoutHistory";
import CalendarScreen from "./features/calendar/CalendarScreen";

function App() {
  const userId = useSelector((state: RootState) => state.auth.myprofile.id);

  if (!userId) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <div style={{ display: "flex" }}>
          {userId && <Sidebar />}
          <main style={{ flexGrow: 1, padding: "20px" }}>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/home" element={<Home />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/profile/:nickname" element={<Profile />} />
              <Route path="/workout_history" element={<WorkoutHistory />} />
              <Route path="/calendar" element={<CalendarScreen />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
