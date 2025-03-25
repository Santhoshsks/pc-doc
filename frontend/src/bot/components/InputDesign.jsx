"use client";
import React, { useState } from "react";
import styles from "./InputDesign.module.css";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import SettingsPanel from "./SettingsPanel";

function InputDesign() {
  const [showSettings, setShowSettings] = useState(false);

  const [messages, setMessages] = useState([
    { type: "bot", text: "👋 Hi, I'm PC-DOC. Ask me anything about cybersecurity!" }
  ]);

  const [settings, setSettings] = useState({
    selectedModel: "Llama3-7B",
    complexity: 3,
    contextSize: 10,
  });

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleResetChat = () => {
    setMessages([
      { type: "bot", text: "👋 Hi, I'm PC-DOC. Ask me anything about cybersecurity!" }
    ]);
  };

  const handleApplySettings = (newSettings) => {
    setSettings(newSettings);
    setShowSettings(false);  
    console.log("Applied Settings:", newSettings); 
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <div className={styles.appContainer}>
        <Sidebar onSettingsClick={toggleSettings} onResetChat={handleResetChat} />
        <MainContent 
            onSettingsClick={toggleSettings} 
            messages={messages}
            settings={settings} 
            setMessages={setMessages} />
        {showSettings && (
          <SettingsPanel
            onClose={toggleSettings}
            onApply={handleApplySettings} 
            initialSettings={settings}   
          />
        )}
      </div>
    </>
  );
}

export default InputDesign;
