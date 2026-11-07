import styles from './RestartButton.module.css';

function RestartButton({ onRestart }) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onRestart}
    >
      🔄 Нова гра
    </button>
  );
}

export default RestartButton;