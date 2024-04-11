import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import styles from "./App.module.css";
import Core from "./features/core/Core";
import ProfilePage from "./features/profile/ProfilePage";
import Record from "./features/record/Record";

function App() {
  return (
    <Router>
      <div className={styles.app}>
        {/* 既存のスタイルを適用しつつ、新しいルーティングを追加 */}
        <Routes>
          <Route path="/" element={<Core />} />{" "}
          {/* Coreコンポーネントをデフォルトページとして表示 */}
          <Route path="/profile/:userId" element={<ProfilePage />} />{" "}
          <Route path="/record" element={<Record />} />{" "}
          {/* プロフィールページへのルーティングを追加 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
