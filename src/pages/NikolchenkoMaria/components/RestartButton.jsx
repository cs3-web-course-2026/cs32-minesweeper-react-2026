import styles from '../Game.module.css';
import { GAME_STATUS } from '../utils/constants';

function RestartButton({ onRestart, status }) {
  const faces = {
    [GAME_STATUS.READY]: '🙂',
    [GAME_STATUS.PLAYING]: '🙂',
    [GAME_STATUS.WIN]: '😎',
    [GAME_STATUS.LOSE]: '😵',
  };

  return (
    <button
      type="button"
      className={styles.restartButton}
      onClick={onRestart}
      aria-label="Почати нову гру"
      title="Почати нову гру"
    >
      {faces[status] ?? faces.ready}
    </button>
  );
}

export default RestartButton;
