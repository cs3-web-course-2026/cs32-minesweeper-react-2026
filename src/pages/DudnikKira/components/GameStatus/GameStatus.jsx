import React from 'react';
import styles from './GameStatus.module.css';

export default function GameStatus({ status }) {
    let message = '';
    if (status === 'win') {
        message = 'Вітаємо! Ви виграли гру! 🎉';
    } else if (status === 'lose') {
        message = 'Гра закінчилася! Ви підірвалися на міні 💥';
    }

    return (
      <div className={styles['game-status']} role="status" aria-live="polite">
          {message}
      </div>
    );
}