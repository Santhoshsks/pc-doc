"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./InputDesign.module.css";

function ChatControls({ onSettingsClick, messages, setMessages, showInput = true }) {
  const [userInput, setUserInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    const botReply = {
      sender: "pc-doc",
      text: `🔍 Analyzing... Based on your query: "${userInput}", here’s a recommendation: Always use strong passwords, avoid public Wi-Fi for sensitive transactions, and monitor your system for unusual activity.`,
    };

    setMessages((prev) => [...prev, userMessage, botReply]);
    setUserInput("");
  };

  return (
    <section className={styles.chatControls} aria-label="PC-DOC Chat Interface">
      <div className={styles.chatContainer}>
        <div className={styles.chatMessages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "user"
                  ? styles.chatBubbleUser
                  : styles.chatBubbleBot
              }
            >
              <div className={styles.chatSender}>
                {msg.sender === "user" ? "You" : "PC-DOC"}
              </div>
              <div className={styles.chatText}>{msg.text}</div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {showInput && (
          <div className={styles.chatInputWrapper}>
            <textarea
              className={styles.chatInput}
              placeholder="Type your cybersecurity question here..."
              rows={2}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className={styles.chatActions}>
              <button className={styles.settingsButton} onClick={onSettingsClick}>
                Settings
              </button>
              <button className={styles.sendButton} onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default ChatControls;
