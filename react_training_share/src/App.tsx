import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./app/store";
import { useEffect, useState } from "react";
import Sidebar from "./features/components/Sidebar";
import Auth from "./features/auth/Auth";
import Home from "./features/home/Home";
import Workout from "./features/workout/Workout";
import Profile from "./features/profile/Profile";
import WorkoutHistory from "./features/workout_history/WorkoutHistory";
import CalendarScreen from "./features/calendar/CalendarScreen";
import {
  useMediaQuery,
  useTheme,
  CircularProgress,
  Box,
} from "@material-ui/core";
import { fetchAsyncGetMyProf } from "./features/api/authApi";
import { logout } from "./features/auth/authSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.myprofile.id);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          await dispatch(fetchAsyncGetMyProf());
        } else {
          await dispatch(logout());
        }
        setIsAuthChecked(true);
      },
      (error) => {
        console.error("Authentication error:", error);
        dispatch(logout());
        setIsAuthChecked(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  if (!isAuthChecked) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      {userId ? (
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {!isMobile && <Sidebar />}
          <main
            style={{
              flexGrow: 1,
              padding: "20px 20px 0",
              marginBottom: isMobile ? "60px" : "0",
            }}
          >
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/profile/:nickname" element={<Profile />} />
              <Route path="/workout_history" element={<WorkoutHistory />} />
              <Route path="/calendar" element={<CalendarScreen />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </main>
          {isMobile && <Sidebar />}
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
