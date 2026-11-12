import styles from "./GameStatus.module.css";
import { GAME_STATUS } from "../constants/game";

export default function GameStatus({ status }) {
  let message = "";

  if (status === GAME_STATUS.WIN) {
    message = "Вітаємо! Ви виграли! 🎉";
  } else if (status === GAME_STATUS.LOSE) {
    message = "Гра закінчена! Ви підірвалися на міні. 💣";
  }

  return (
    <div className={styles.status} role="status" aria-live="polite">
      {message}
    </div>
  );
}
