import { formatCounter } from '../utils/format';

import styles from './CounterDisplay.module.css';

function Timer({ seconds }) {
  const formattedTime = formatCounter(seconds);

  return (
    <div className={styles.counter} aria-label={`Час гри: ${seconds} секунд`}>
      {formattedTime}
    </div>
  );
}

export default Timer;

