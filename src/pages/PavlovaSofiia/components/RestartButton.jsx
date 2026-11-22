import styles from './RestartButton.module.css';

export default function RestartButton({ onRestart }) {
  return (
    <button
      className={styles.button}
      onClick={onRestart}
      aria-label="Restart game"
    >
      ▶
    </button>
  );
}
