import { GAME_STATUS } from '../constants/game';
import styles from './RestartButton.module.css';

function RestartButton({ gameStatus, onRestart }) {
  let emoji = '🙂';
  if (gameStatus === GAME_STATUS.WIN) {
    emoji = '😎';
  } else if (gameStatus === GAME_STATUS.LOSE) {
    emoji = '😵';
  }

  return (
    <button
      type="button"
      className={styles.btnStart}
      title="Почати нову гру"
      onClick={onRestart}
    >
      <span className={styles.btnIcon} aria-hidden="true">
        {emoji}
      </span>
      <span className={styles.btnText}>Старт</span>
    </button>
  );
}

export default RestartButton;
