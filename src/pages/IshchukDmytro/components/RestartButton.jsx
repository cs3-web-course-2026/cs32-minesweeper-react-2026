import styles from '../Game.module.css';

export default function RestartButton({ onRestart }) {
  return (
    <button type="button" className={styles.button} onClick={onRestart}>
      Нова гра
    </button>
  );
}
