
import styles from '../Minesweeper.module.css';

export default function Timer({ seconds }) {
  const formattedTime = String(seconds).padStart(3, '0');

  return (
    <div
      className={styles.stat}
      aria-label={`Час гри: ${seconds} секунд`}
    >
      ⏱️ {formattedTime}
    </div>
  );
}
