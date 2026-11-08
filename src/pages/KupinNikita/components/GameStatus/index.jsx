import styles from './GameStatus.module.css';
import { GAME_STATUS } from '../../constants';

function GameStatus({ status }) {
  let message = '🎮 Гра триває';
  let className = styles.status;

  if (status === GAME_STATUS.WON) {
    message = '🎉 Ви перемогли!';
    className = `${styles.status} ${styles.won}`;
  } else if (status === GAME_STATUS.LOST) {
    message = '💥 Гру завершено. Ви програли!';
    className = `${styles.status} ${styles.lost}`;
  }

  return (
    <div role="status" aria-live="polite">
      <h2 className={className}>{message}</h2>
    </div>
  );
}

export default GameStatus;