
import { GAME_STATUS } from '../constants/game';

import styles from '../Minesweeper.module.css';

export default function RestartButton({ gameStatus, onRestart }) {
  let face = '😇';

  if (gameStatus === GAME_STATUS.WON) {
    face = '😎';
  } else if (gameStatus === GAME_STATUS.LOST) {
    face = '😵';
  }

  return (
    <button
      type="button"
      className={styles.restart}
      onClick={onRestart}
      aria-label="Почати нову гру"
    >
      {face}
    </button>
  );
}
