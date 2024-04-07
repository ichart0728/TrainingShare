import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import styles from "./App.module.css";
import Core from "./features/core/Core";
import ProfilePage from "./features/profile/ProfilePage"; // ProfilePageコンポーネントをインポート

function App() {
  return (
    <Router>
      <div className={styles.app}>
        {/* 既存のスタイルを適用しつつ、新しいルーティングを追加 */}
        <Routes>
          <Route path="/" element={<Core />} />{" "}
          {/* Coreコンポーネントをデフォルトページとして表示 */}
          <Route path="/profile/:userId" element={<ProfilePage />} />{" "}
          {/* プロフィールページへのルーティングを追加 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
