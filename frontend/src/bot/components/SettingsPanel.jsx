"use client";
import React, { useState } from "react";
import styles from "./InputDesign.module.css";

// EnhancedSlider component remains unchanged
const EnhancedSlider = ({ 
  min = 1, 
  max = 5, 
  value, 
  onChange, 
  showMarkers = true,
  ariaLabel 
}) => {
  const handleChange = (e) => {
    onChange(parseInt(e.target.value, 10));
  };

  const getTrackStyle = () => {
    const percentage = ((value - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, #1890ff ${percentage}%, #e6e6e6 ${percentage}%)`
    };
  };

  return (
    <div className={styles.enhancedSlider}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className={styles.slider}
        style={getTrackStyle()}
        aria-label={ariaLabel}
      />
      
      {showMarkers && (
        <div className={styles.sliderMarkers}>
          {Array.from({ length: max - min + 1 }, (_, i) => (
            <div 
              key={i} 
              className={`${styles.marker} ${value >= i + min ? styles.markerActive : ''}`}
            >
              <span className={styles.markerValue}>{i + min}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function SettingsPanel({ onClose, onApply, initialSettings }) {
  const [selectedModel, setSelectedModel] = useState(initialSettings?.selectedModel || "Llama3-7B");
  const [complexity, setComplexity] = useState(initialSettings?.complexity || 3);
  const [contextSize, setContextSize] = useState(initialSettings?.contextSize || 10);

  const handleApplyClick = () => {
    onApply({
      selectedModel,
      complexity,
      contextSize,
    });
  };

  return (
    <aside className={styles.settingsPanel} aria-label="Settings panel">
      <div className={styles.settingsHeader}>
        <h2 className={styles.settingsTitle}>Settings</h2>
        <button
          className={styles.closeIcon}
          onClick={onClose}
          aria-label="Close settings"
        >
          <i className="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>

      <div>
        <section className={styles.modelSection}>
          <h3 className={styles.sectionTitle}>Model Selection</h3>
          <div className={styles.modelSelectorContainer}>
            {["Llama3-7B", "Mistral-7B", "Deepseek r1"].map((model) => (
              <button
                key={model}
                className={`${styles.modelSelectorButton} ${selectedModel === model ? styles.modelSelectorButtonSelected : ""}`}
                onClick={() => setSelectedModel(model)}
                aria-pressed={selectedModel === model}
              >
                {model}
              </button>
            ))}
          </div>
          <p className={styles.modelDescription}>
            Select the AI model that best suits your needs.
          </p>
        </section>

        <section className={styles.complexitySection}>
          <h3 className={styles.sectionTitle}>Response Complexity</h3>
          <div className={styles.sliderHeader}>
            <span className={styles.sliderLabel}>Beginner</span>
            <span className={styles.currentValue}>{complexity}</span>
            <span className={styles.sliderLabel}>Expert</span>
          </div>
          <EnhancedSlider 
            min={1} 
            max={5}
            value={complexity} 
            onChange={setComplexity}
            ariaLabel="Response complexity setting" 
          />
          <div className={styles.complexityDescription}>
            {complexity === 1 && "Basic explanations for beginners"}
            {complexity === 2 && "Simplified technical terms"}
            {complexity === 3 && "Balanced technical detail"}
            {complexity === 4 && "Advanced technical concepts"}
            {complexity === 5 && "Expert-level technical analysis"}
          </div>
        </section>

        <section className={styles.contextSection}>
          <h3 className={styles.sectionTitle}>Context Size</h3>
          <div className={styles.sliderHeader}>
            <span className={styles.sliderLabel}>5</span>
            <span className={styles.currentValue}>{contextSize}</span>
            <span className={styles.sliderLabel}>15</span>
          </div>
          <EnhancedSlider 
            min={5} 
            max={15}
            value={contextSize} 
            onChange={setContextSize}
            showMarkers={false}
            ariaLabel="Context size setting" 
          />
        </section>

        <div className={styles.buttonGroup}>
          <button 
            className={styles.resetButton}
            onClick={() => {
              setSelectedModel("Llama3-7B");
              setComplexity(3);
              setContextSize(10);
            }}
          >
            Reset
          </button>

          <button className={styles.applyButton} onClick={handleApplyClick}>
            Apply Settings
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SettingsPanel;
