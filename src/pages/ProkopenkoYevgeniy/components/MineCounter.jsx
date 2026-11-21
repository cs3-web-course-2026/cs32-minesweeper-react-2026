import { formatCounter } from '../utils/format';

import styles from './CounterDisplay.module.css';

function MineCounter({ remainingMines }) {
  const formattedValue = formatCounter(remainingMines);

  return (
    <div
      className={styles.counter}
      role="status"
      aria-live="polite"
      aria-label={`Кількість доступних прапорців: ${remainingMines}`}
    >
      {formattedValue}
    </div>
  );
}

export default MineCounter;

