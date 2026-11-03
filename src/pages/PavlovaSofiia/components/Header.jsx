import Timer from './Timer';
import RestartButton from './RestartButton';

import styles from './Header.module.css';

export default function Header({ time, flags, onRestart }) {
  return (
    <div className={styles.header}>
      <Timer time={time} />

      <p>{flags} flags</p>

      <RestartButton onRestart={onRestart} />
    </div>
  );
}
