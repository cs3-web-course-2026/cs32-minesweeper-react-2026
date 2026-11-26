import { formatCounter } from '../utils/format';
import styles from './Counter.module.css';


function Counter({ icon, label, value, isLive = false }) {
  return (
    <p
      className={styles.counter}
      role={isLive ? 'status' : undefined}
      aria-live={isLive ? 'polite' : undefined}
    >
      <span className={styles.visuallyHidden}>{label}</span>
      <span aria-hidden="true">{icon}</span>
      <span className={styles.value}>{formatCounter(value)}</span>
    </p>
  );
}

export default Counter;
