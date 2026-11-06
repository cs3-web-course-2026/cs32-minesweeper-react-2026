import styles from './Timer.module.css';

function Timer({ time }) {
  const minutes = String(
    Math.floor(time / 60)
  ).padStart(2, '0');

  const seconds = String(
    time % 60
  ).padStart(2, '0');

  return (
    <span className={styles.timer}>
      Time: {minutes}:{seconds}
    </span>
  );
}

export default Timer;