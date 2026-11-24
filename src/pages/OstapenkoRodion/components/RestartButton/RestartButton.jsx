import React from 'react';
import styles from './RestartButton.module.css';

const RestartButton = ({ status, onRestart }) => {
  let face = '🙂';
  if (status === 'win') face = '😎';
  if (status === 'lose') face = '😵';

  return (
    <button className={styles.btn} type="button" onClick={onRestart} aria-label="Нова гра">
      {face}
    </button>
  );
};

export default RestartButton;