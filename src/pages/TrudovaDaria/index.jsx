import Board from "./components/Board";
import GameHeader from "./components/GameHeader";
import GameStatus from "./components/GameStatus";
import { useGameState } from "./hooks/useGameState";
import { isGameOver } from "./utils/checks";

import styles from "./Game.module.css";

function TrudovaDariaGame() {
  const {
    board,
    gameStatus,
    elapsedSeconds,
    minesRemaining,
    isFlagMode,
    isFlagLimitReached,
    handleCellClick,
    handleCellFlag,
    handleToggleFlagMode,
    handleRestart,
  } = useGameState();

  return (
    <main className={styles.game}>
      <GameHeader
        minesRemaining={minesRemaining}
        elapsedSeconds={elapsedSeconds}
        isFlagMode={isFlagMode}
        onRestart={handleRestart}
        onToggleFlagMode={handleToggleFlagMode}
      />

      <Board
        board={board}
        isDisabled={isGameOver(gameStatus)}
        onCellClick={handleCellClick}
        onCellFlag={handleCellFlag}
      />

      <GameStatus
        gameStatus={gameStatus}
        elapsedSeconds={elapsedSeconds}
        isFlagLimitReached={isFlagLimitReached}
      />
    </main>
  );
}

export default TrudovaDariaGame;
