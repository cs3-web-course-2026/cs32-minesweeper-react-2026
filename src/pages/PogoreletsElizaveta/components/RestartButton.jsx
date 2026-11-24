import { GAME_STATUS } from "../constants/game";
import styles from "./RestartButton.module.css";

export default function RestartButton({ onRestart, status }) {
  let face = "🤓";

  if (status === GAME_STATUS.WIN) {
    face = "😎";
  } else if (status === GAME_STATUS.LOSE) {
    face = "😵";
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onRestart}
      title="Начать новую игру"
      aria-label="Перезапустить игру"
    >
      {face}
    </button>
  );
}