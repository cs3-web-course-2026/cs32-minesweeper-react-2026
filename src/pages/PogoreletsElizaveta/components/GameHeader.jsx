import FlagCounter from "./FlagCounter";
import Timer from "./Timer";
import RestartButton from "./RestartButton";
import styles from "./GameHeader.module.css";

export default function GameHeader({ flagsCount, seconds, status, onRestart }) {
  return (
    <header className={styles.header}>
      <FlagCounter count={flagsCount} />
      <RestartButton onRestart={onRestart} status={status} />
      <Timer seconds={seconds} />
    </header>
  );
}
