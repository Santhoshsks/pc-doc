import React, { useState } from "react";
import styles from "./InputDesign.module.css";
import ChatControls from "./ChatControls";

function MainContent({ onSettingsClick, messages, setMessages, settings }) {
  const [activeTab, setActiveTab] = useState("CHAT");

  return (
    <main className={styles.mainContent}>
      <section className={styles.contentArea}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>PC-DOC: Your Cybersecurity Assistant</h1>
          <p className={styles.subtitle}>
            An intelligent cybersecurity chatbot that helps you get solutions and understand vulnerabilities with adjustable settings as per your needs.
          </p>
        </div>

        <div className={styles.tabSection}>
          <div className={styles.tabs} role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === "CHAT"}
              className={activeTab === "CHAT" ? styles.tabactive : styles.tab}
              onClick={() => setActiveTab("CHAT")}
            >
              CHAT
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "HISTORY"}
              className={activeTab === "HISTORY" ? styles.tabactive : styles.tab}
              onClick={() => setActiveTab("HISTORY")}
            >
              HISTORY
            </button>
          </div>
        </div>

        {(activeTab === "CHAT" || activeTab === "HISTORY") && (
          <div className={styles.chatContainer}>
            <ChatControls
              onSettingsClick={onSettingsClick}
              messages={messages}
              setMessages={setMessages}
              settings={settings}
              showInput={activeTab === "CHAT"}
            />
          </div>
        )}
      </section>
    </main>
  );
}


export default MainContent;
