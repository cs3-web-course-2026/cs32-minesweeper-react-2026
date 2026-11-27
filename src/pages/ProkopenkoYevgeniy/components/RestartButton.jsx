import { GAME_STATUS, STATUS_EMOJI } from '../constants/game';

import styles from './RestartButton.module.css';

function RestartButton({ gameStatus, onRestart }) {
  const emoji = STATUS_EMOJI[gameStatus] ?? STATUS_EMOJI[GAME_STATUS.IDLE];

  return (
    <button
      type="button"
      className={styles.restartButton}
      onClick={onRestart}
      aria-label="Нова гра"
    >
      {emoji}
    </button>
  );
}

export default RestartButton;

