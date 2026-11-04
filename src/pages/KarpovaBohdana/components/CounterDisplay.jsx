import { formatDisplay } from '../utils/view';

import styles from './CounterDisplay.module.css';


/** Табло з трьох цифр у вигляді таблички з німого кіно. */
function CounterDisplay({ caption, value, label, role }) {
  return (
    <div className={styles.counter} role={role} aria-label={label}>
      <span className={styles.caption} aria-hidden="true">
        {caption}
      </span>
      <span className={styles.value}>{formatDisplay(value)}</span>
    </div>
  );
}

export default CounterDisplay;
