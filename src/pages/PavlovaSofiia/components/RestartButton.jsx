import styles from './RestartButton.module.css';

export default function RestartButton({ onRestart }) {
  return (
    <button type="button" className={styles.button} onClick={onRestart}>
      ▶
    </button>
  );
}
