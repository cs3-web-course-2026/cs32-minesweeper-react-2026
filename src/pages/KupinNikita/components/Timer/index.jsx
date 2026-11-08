import styles from './Timer.module.css';

function Timer({ time }) {
  return (
    <div className={styles.timer}>
      ⏱ Час: {time} сек.
    </div>
  );
}

export default Timer;