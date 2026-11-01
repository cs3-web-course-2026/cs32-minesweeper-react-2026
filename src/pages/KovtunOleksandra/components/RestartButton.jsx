import React from 'react';
import styles from '../Game.module.css';

export default function RestartButton({ gameState, initGame }) {
  const getEmoji = () => {
    switch (gameState) {
      case 'win': return '😻';
      case 'lose': return '😿';
      default: return '😺';
    }
  };

  return (
    <button className={styles.resetBtn} onClick={initGame} aria-label="Нова гра">
      {getEmoji()}
    </button>
  );
}