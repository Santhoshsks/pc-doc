"use client";
import React, { useState, useRef } from "react";
import styles from "./InputDesign.module.css";

function Slider({ leftLabel, rightLabel, initialValue = 50, ariaLabel }) {
  const [value, setValue] = useState(initialValue);
  const sliderRef = useRef(null);

  const handleClick = (e) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setValue(percentage);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      setValue(Math.max(0, value - 5));
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      setValue(Math.min(100, value + 5));
      e.preventDefault();
    }
  };

  return (
    <div className={styles.sliderContainer}>
      <span className={styles.label}>{leftLabel}</span>
      <div
        ref={sliderRef}
        className={styles.slider}
        onClick={handleClick}
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={value}
        tabIndex="0"
        onKeyDown={handleKeyDown}
      >
        <div className={styles.sliderTrack} style={{ width: `${value}%` }} />
        <div className={styles.sliderThumb} style={{ left: `${value}%` }} />
      </div>
      <span className={styles.label}>{rightLabel}</span>
    </div>
  );
}

export default Slider;
