import React from 'react';
import styles from './RestartButton.module.css';

export default function RestartButton({ onReset }) {
    return (
      <button
        type="button"
        className={styles['smile-btn']}
        onClick={onReset}
        aria-label="Нова гра"
      >
          😊
      </button>
    );
}