import FlagModeButton from "./FlagModeButton";
import MineCounter from "./MineCounter";
import RestartButton from "./RestartButton";
import Timer from "./Timer";

import styles from "./GameHeader.module.css";

function GameHeader({
  minesRemaining,
  elapsedSeconds,
  isFlagMode,
  onRestart,
  onToggleFlagMode,
}) {
  return (
    <header className={styles.header}>
      <MineCounter minesRemaining={minesRemaining} />

      <div className={styles.controls}>
        <RestartButton onRestart={onRestart} />
        <FlagModeButton isFlagMode={isFlagMode} onToggle={onToggleFlagMode} />
      </div>

      <Timer elapsedSeconds={elapsedSeconds} />
    </header>
  );
}

export default GameHeader;
