import styles from './RestartButton.module.css';

function RestartButton({ onRestart }) {
  return (
    <button
      type="button"
      className={styles.restartButton}
      onClick={onRestart}
      aria-label="Start a new game"
    >
      Start a new game 🌸
    </button>
  );
}

export default RestartButton;