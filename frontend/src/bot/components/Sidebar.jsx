import React from "react";
import styles from "./InputDesign.module.css";

function Sidebar({ onSettingsClick, onResetChat }) {
  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <button
        className={styles.plusButton}
        aria-label="New Chat"
        onClick={onResetChat}
        title="Start New Chat"
      >
        <i className="ti ti-plus" aria-hidden="true"></i>
      </button>

      <div className={styles.bottomIcons}>
        <button className={styles.iconItem} aria-label="Settings" title="Settings" onClick={onSettingsClick}>
          <i className="ti ti-settings" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItem} aria-label="Messages" title="Messages">
          <i className="ti ti-message-circle" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItem} aria-label="Security" title="Security">
          <i className="ti ti-shield-lock" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItem} aria-label="Language Settings" title="Language">
          <i className="ti ti-globe" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItem} aria-label="System Activity" title="System Activity">
          <i className="ti ti-activity" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItem} aria-label="Dummy" title="Dummy">
          <i className="ti ti-file-shield" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItem} aria-label="Dummy" title="Dummy">
          <i className="ti ti-file-shield" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItem} aria-label="Help Center" title="Help Center">
          <i className="ti ti-help-circle" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItemavatar} aria-label="Profile" title="Profile">
          <img
            src="bot.png"
            alt="User avatar"
            className={styles.img}
          />
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
