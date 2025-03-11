import React from "react";
import styles from "./InputDesign.module.css";

function Sidebar() {
  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <button className={styles.pauseButton} aria-label="Pause">
        <i className="ti ti-player-pause" aria-hidden="true"></i>
      </button>
      <div className={styles.sidebarIcons}>
        <button className={styles.iconItem} aria-label="Microphone">
          <i className="ti ti-microphone" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItem} aria-label="Users">
          <i className="ti ti-users" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItem} aria-label="Language">
          <i className="ti ti-language" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItem} aria-label="Volume">
          <i className="ti ti-volume" aria-hidden="true"></i>
        </button>
      </div>
      <div className={styles.bottomIcons}>
        <button className={styles.iconItem} aria-label="Circle">
          <i className="ti ti-circle" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItem} aria-label="Square">
          <i className="ti ti-square" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItem} aria-label="Heart">
          <i className="ti ti-heart" aria-hidden="true"></i>
        </button>
        <button className={styles.iconItemavatar} aria-label="Profile">
          <img
            src="https://placehold.co/32x32/e1e1e1/e1e1e1"
            alt="User avatar"
            className={styles.img}
          />
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
