import { DISPLAY_DIGITS } from '../constants/gameConstants';
import styles from '../KhomiakovOleksii.module.css';

export default function Counter({ value, ariaLabel, isPolite = false }) {
  const formattedValue = String(Math.max(0, value)).padStart(DISPLAY_DIGITS, '0');

  return (
    <div
      className={styles.counter}
      role={isPolite ? 'status' : undefined}
      aria-live={isPolite ? 'polite' : undefined}
      aria-label={ariaLabel}
    >
      {formattedValue}
    </div>
  );
}