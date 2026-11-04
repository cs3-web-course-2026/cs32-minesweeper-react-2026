
import styles from '../Game.module.css';

function RestartButton({ onRestart, status }) {
  const faces = {
    ready: '🙂',
    playing: '🙂',
    win: '😎',
    lose: '😵',
  };

  return (
    <button
      type="button"
      className={styles.restartButton}
      onClick={onRestart}
      aria-label="Почати нову гру"
      title="Почати нову гру"
    >
      {faces[status] ?? faces.ready}
    </button>
  );
}

export default RestartButton;
