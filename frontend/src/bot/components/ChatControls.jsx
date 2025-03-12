"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./InputDesign.module.css";

function ChatControls({ onSettingsClick, messages, setMessages, showInput = true, settings }) {
  const [userInput, setUserInput] = useState("");
  const chatEndRef = useRef(null);

  const sendMessageToApi = async ({ message, model, complexity, top_k }) => {
    try {
      const response = await fetch("http://localhost:8000/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          model: model,
          complexity: complexity,
          top_k: top_k,
        }),
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("API error:", error);
      return "⚠️ Something went wrong. Please try again later.";
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmedMessage = userInput.trim();
    if (!trimmedMessage) return;

    setMessages((prev) => [...prev, { type: "user", text: trimmedMessage }]);

    setMessages((prev) => [...prev, { type: "bot", text: "🤖 Thinking..." }]);
    setUserInput(""); 

    const botResponse = await sendMessageToApi({
      message: trimmedMessage,
      model: settings.selectedModel,
      complexity: settings.complexity,
      top_k: settings.contextSize,
    });

    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = { type: "bot", text: botResponse };
      return updated;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className={styles.chatControls} aria-label="PC-DOC Chat Interface">
      <div className={styles.chatContainer}>
        <div className={styles.chatMessages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.type === "user"
                  ? styles.chatBubbleUser
                  : styles.chatBubbleBot
              }
            >
              <div className={styles.chatSender}>
                {msg.type === "user" ? "You" : "PC-DOC"}
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
              rows={3}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <div className={styles.chatActions}>
              <button className={styles.settingsButton} onClick={onSettingsClick}>
                Settings
              </button>
              <button className={styles.sendButton} onClick={handleSendMessage}>
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
