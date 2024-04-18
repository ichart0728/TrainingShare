import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./app/store";

import Sidebar from "./features/components/Sidebar";
import Home from "./features/home/Home";
import Workout from "./features/workout/Workout";
import Profile from "./features/profile/Profile";
// import Graph from "./pages/Graph";

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
            <Route path="/" element={<Home />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/profile/:nickname" element={<Profile />} />
            {/* <Route path="/graph" element={<Graph />} /> */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
