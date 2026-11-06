import RestartButton from './RestartButton';
import Timer from './Timer';

import styles from './GameHeader.module.css';

function GameHeader({ time, flagsLeft, onRestart }) {
  return (
    <header className={styles.header}>
      <RestartButton onRestart={onRestart} />

      <span className={styles.counter}>
        Mines: {flagsLeft}
      </span>

      <Timer time={time} />
    </header>
  );
}

export default GameHeader;