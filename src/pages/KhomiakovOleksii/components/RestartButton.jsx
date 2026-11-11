import { GAME_STATUS } from '../constants/gameConstants';
import styles from '../KhomiakovOleksii.module.css';

export default function RestartButton({ status, onRestart }) {
  let emoji = '🙂';
  if (status === GAME_STATUS.WIN) {
    emoji = '😎';
  } else if (status === GAME_STATUS.LOSE) {
    emoji = '😵';
  }

  return (
    <button
      className={styles.resetBtn}
      type="button"
      aria-label="Почати нову гру"
      onClick={onRestart}
    >
      {emoji}
    </button>
  );
}