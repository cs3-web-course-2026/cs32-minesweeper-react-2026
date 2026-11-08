import React from 'react';
import styles from '../Minesweeper.module.css';

export default function GameStatus({ status }) {
    if (status === 'idle' || status === 'process') {
        return <div className={styles.gameStatus} role="status" aria-live="polite"></div>;
    }

    return (
        <div className={styles.gameStatus} role="status" aria-live="polite">
            {status === 'win' && 'Ви перемогли! 😎'}
            {status === 'lose' && 'Гру закінчено. Ви натрапили на міну! 💥'}
        </div>
    );
}