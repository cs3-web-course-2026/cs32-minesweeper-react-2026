import React from 'react';
import styles from '../Minesweeper.module.css';

export default function Header({ time, flagsLeft, status, onRestart }) {
    const timeFormatted = String(time).padStart(3, '0');
    const flagsFormatted = String(Math.max(0, flagsLeft)).padStart(3, '0');
    
    let btnFace = '🙂';
    if (status === 'win') btnFace = '😎';
    if (status === 'lose') btnFace = '😵';

    return (
        <header className={styles.gameHeader}>
            <div className={styles.timer}>⏱{timeFormatted}</div>
            <button
                type="button"
                className={styles.startBtn}
                onClick={onRestart}
                aria-label="Start new game"
                title="Start new game"
            >
                {btnFace}
            </button>
            <div className={styles.flagCounter}>🚩 {flagsFormatted}</div>
        </header>
    );
}