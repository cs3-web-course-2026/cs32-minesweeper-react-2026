import styles from './RestartButton.module.css';

export function RestartButton({ onRestart }) {
  return (
    <button type="button" className={styles.button} onClick={onRestart}>
      🔄 Нова гра
    </button>
  );
}