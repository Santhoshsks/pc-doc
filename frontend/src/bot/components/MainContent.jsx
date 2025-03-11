import React, { useState } from "react";
import styles from "./InputDesign.module.css";
import ChatControls from "./ChatControls";

function MainContent({ onSettingsClick }) {
  const [activeTab, setActiveTab] = useState("CHAT");

  // Example message array — replace with your actual chat state later
  const [messages, setMessages] = useState([
    { type: "bot", text: "👋 Hi, I'm PC-DOC. Ask me anything about cybersecurity!" },
    { type: "user", text: "Tell me about CVE-2023-12345" },
    { type: "bot", text: "CVE-2023-12345 is a remote code execution vulnerability..." }
  ]);

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

        {activeTab === "CHAT" && (
          <div className={styles.chatContainer}>
            <div className={styles.chatMessages}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.type === "bot" ? styles.botMessage : styles.userMessage
                  }
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className={styles.chatInputWrapper}>
              <ChatControls onSettingsClick={onSettingsClick} activeTab={activeTab} />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default MainContent;
