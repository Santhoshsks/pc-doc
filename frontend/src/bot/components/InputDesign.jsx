"use client";
import React, { useState } from "react";
import styles from "./InputDesign.module.css";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import SettingsPanel from "./SettingsPanel";

function InputDesign() {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <div className={styles.appContainer}>
        <Sidebar />
        <MainContent onSettingsClick={toggleSettings} />
        {showSettings && <SettingsPanel onClose={toggleSettings} />}
      </div>
    </>
  );
}

export default InputDesign;
