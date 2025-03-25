import React from "react";
import styles from "./InputDesign.module.css";

function Sidebar({ onSettingsClick, onResetChat }) {
  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.topIcons}>
        <button
          className={styles.iconItem}
          aria-label="New Chat"
          onClick={onResetChat}
          title="Start New Chat"
        >
          <i className="ti ti-plus" aria-hidden="true"></i>
        </button>
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
      </div>

      <div className={styles.bottomIcons}>
      <a
          className={styles.iconItem}
          href="https://github.com/Santhoshsks/pc-doc" 
          target="_blank"
          aria-label="Help Center"
          title="Help Center"
        >
          <i className="ti ti-help-circle" aria-hidden="true"></i>
        </a>
        <button className={styles.iconItem} aria-label="Profile" title="Profile">
          <img src="bot.png" alt="User avatar" className={styles.img} />
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
