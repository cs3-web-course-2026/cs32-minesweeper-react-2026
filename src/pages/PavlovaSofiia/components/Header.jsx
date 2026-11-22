import Timer from './Timer';
import RestartButton from './RestartButton';

import styles from './Header.module.css';

export default function Header({ time, flags, onRestart }) {
  return (
    <header className={styles.header}>
      <Timer time={time} />

      <p>{flags} flags</p>

      <RestartButton onRestart={onRestart} />
    </header>
  );
}
