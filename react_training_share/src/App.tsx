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
  const nickName = useSelector(
    (state: RootState) => state.auth.myprofile.nickName
  );
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        {nickName && <Sidebar />}
        <main style={{ flexGrow: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route
              path="/home"
              element={nickName ? <Home /> : <Navigate to="/" />}
            />
            <Route
              path="/workout"
              element={nickName ? <Workout /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:nickname"
              element={nickName ? <Profile /> : <Navigate to="/" />}
            />
            <Route
              path="/workout_history"
              element={nickName ? <WorkoutHistory /> : <Navigate to="/" />}
            />
            <Route
              path="/calendar"
              element={nickName ? <CalendarScreen /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
