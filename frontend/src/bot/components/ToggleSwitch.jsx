"use client";
import React, { useState } from "react";
import styles from "./InputDesign.module.css";

function ToggleSwitch({ id, initialState = false }) {
  const [isOn, setIsOn] = useState(initialState);

  const toggle = () => {
    setIsOn(!isOn);
  };

  return (
    <button
      className={styles.toggleSwitch}
      onClick={toggle}
      role="switch"
      aria-checked={isOn}
      id={id}
    >
      <div
        className={styles.switch}
        style={{
          transform: isOn ? "translateX(20px)" : "translateX(0)",
          backgroundColor: isOn ? "#111827" : "#fff",
        }}
      />
    </button>
  );
}

export default ToggleSwitch;
