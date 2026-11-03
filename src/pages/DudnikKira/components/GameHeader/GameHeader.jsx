import React from 'react';
import RestartButton from '../RestartButton/RestartButton';
import styles from './GameHeader.module.css';

export default function GameHeader({ flagsLeft, gameTime, onReset }) {
  const formatNumber = (num) => String(num).padStart(3, '0');

  return (
    <header className={styles['game-header']}>
      <div
        className={styles.counter}
        role="status"
        aria-live="polite"
        aria-label={`Залишилось прапорців: ${flagsLeft}`}
      >
        {formatNumber(flagsLeft)}
      </div>
      <RestartButton onReset={onReset} />
      <div
        className={styles.counter}
        role="timer"
        aria-label={`Час гри: ${gameTime} секунд`}
      >
        {formatNumber(gameTime)}
      </div>
    </header>
  );
}