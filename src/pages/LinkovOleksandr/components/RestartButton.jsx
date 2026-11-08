import React from 'react';
import styles from '../Minesweeper.module.css';

export default function RestartButton({ status, onRestart }) {
    let btnFace = '🙂';
    if (status === 'win') btnFace = '😎';
    if (status === 'lose') btnFace = '😵';

    return (
        <button
            type="button"
            className={styles.startBtn}
            onClick={onRestart}
            aria-label="Start new game"
            title="Start new game"
        >
            {btnFace}
        </button>
    );
}