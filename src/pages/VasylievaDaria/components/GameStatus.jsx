
import { GAME_STATUS } from '../constants/game';

import styles from '../Minesweeper.module.css';

export default function GameStatus({ gameStatus }) {
  let message = '';

  if (gameStatus === GAME_STATUS.WON) {
    message = '🎉 Вітаємо! Ви перемогли!';
  } else if (gameStatus === GAME_STATUS.LOST) {
    message = '💥 Гру завершено! Ви програли.';
  }

  return (
    <div
      className={styles.message}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
