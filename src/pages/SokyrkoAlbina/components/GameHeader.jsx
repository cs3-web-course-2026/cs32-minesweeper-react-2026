import { ICONS, START_BTN_ICONS } from '../constants/gameConfig';
import styles from './GameHeader.module.css';

export default function GameHeader({ flagsLeft, gameTime, gameStatus, onRestart }) {
  const formattedFlags = String(Math.max(0, flagsLeft)).padStart(3, '0');
  const formattedTime = String(gameTime).padStart(3, '0');

  return (
    <header className={styles.gameHeader}>
      <div
        className={styles.display}
        role="status"
        aria-live="polite"
        aria-label="Кількість прапорців"
        title="Прапорці"
      >
        <span>{ICONS.FLAG}</span>
        <span>{formattedFlags}</span>
      </div>

      <button
        type="button"
        className={styles.startBtn}
        onClick={onRestart}
        aria-label="Почати нову гру"
      >
        {START_BTN_ICONS[gameStatus]}
      </button>

      <div className={styles.display} aria-label="Час гри" title="Час">
        <span>⏳</span>
        <span>{formattedTime}</span>
      </div>
    </header>
  );
}