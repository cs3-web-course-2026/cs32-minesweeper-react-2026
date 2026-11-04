import { GAME_STATUS } from '../constants/game';
import styles from './GameStatus.module.css';

function GameStatus({ gameStatus }) {
  let message = '';
  let statusClass = styles.gameStatus;

  if (gameStatus === GAME_STATUS.WIN) {
    message = 'Перемога! Всі безпечні клітинки успішно відкрито.';
    statusClass += ` ${styles.win}`;
  } else if (gameStatus === GAME_STATUS.LOSE) {
    message = 'Поразка! Ви підірвалися на міні.';
    statusClass += ` ${styles.lose}`;
  }

  return (
    <div className={statusClass} role="status" aria-live="polite">
      {message}
    </div>
  );
}

export default GameStatus;
