import React from 'react';
import styles from '../Minesweeper.module.css';

export default function Timer({ time }) {
    const timeFormatted = String(time).padStart(3, '0');
    return <div className={styles.timer}>⏱{timeFormatted}</div>;
}