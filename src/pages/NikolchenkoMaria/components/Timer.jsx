
import styles from '../Game.module.css';

function Timer({ seconds }) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

  return (
    <div className={styles.gameInfo}>
      <span className={styles.label}>Час</span>
      <span
        className={styles.value}
        role="timer"
        aria-label={`Час гри: ${formattedTime}`}
      >
        {formattedTime}
      </span>
    </div>
  );
}

export default Timer;
