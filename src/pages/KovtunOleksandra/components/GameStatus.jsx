import React from 'react';
import styles from '../Game.module.css';

export default function GameStatus({ gameState, gameTime }) {
  if (gameState === 'process') return null;

  return (
    <div className={styles.statusMessage} role="status" aria-live="polite">
      {gameState === 'win' 
        ? `🎉 Ура! Ви перемогли за ${gameTime} сек. Всі котики знайдені!` 
        : '🐾 Ой, вас спіймав котик! Гра закінчена.'}
    </div>
  );
}