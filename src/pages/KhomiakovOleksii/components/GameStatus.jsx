import { GAME_STATUS } from '../constants/gameConstants';
import styles from '../KhomiakovOleksii.module.css';

export default function GameStatus({ status }) {
  let message = '';
  if (status === GAME_STATUS.WIN) {
    message = 'Вітаємо! Ви розмінували поле!';
  } else if (status === GAME_STATUS.LOSE) {
    message = 'Гру закінчено! Ви підірвались на міні.';
  }

  return (
    <div className={styles.gameStatusMessage} role="status" aria-live="polite">
      {message}
    </div>
  );
}