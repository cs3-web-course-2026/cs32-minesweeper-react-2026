import React from 'react';
import styles from './RestartButton.module.css';

export default function RestartButton({ onReset }) {
    return (
        <button
            type="button"
            className={styles.smileBtn}
            onClick={onReset}
            aria-label="Нова гра"
        >
            😊
        </button>
    );
}