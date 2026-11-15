
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';
import Timer from './components/Timer';

import { useGameState } from './hooks/useGameState';
import { useTimer } from './hooks/useTimer';

import styles from './Minesweeper.module.css';

export default function Minesweeper() {
  const {
    board,
    gameStatus,
    gameNumber,
    explodedCell,
    minesRemaining,
    handleRestart,
    handleCellClick,
    handleCellRightClick,
  } = useGameState();

  const seconds = useTimer(gameStatus, gameNumber);

  return (
    <main className={styles.game}>
      <h1 className={styles.title}>Сапер</h1>

      <header className={styles.header}>
        <div
          className={styles.stat}
          aria-label={`Залишилося прапорців: ${minesRemaining}`}
        >
          🚩 {minesRemaining}
        </div>

        <RestartButton
          gameStatus={gameStatus}
          onRestart={handleRestart}
        />

        <Timer seconds={seconds} />
      </header>

      <button
        type="button"
        className={styles.action}
        onClick={handleRestart}
      >
        🔄 Нова гра
      </button>

      <Board
        board={board}
        explodedCell={explodedCell}
        onReveal={handleCellClick}
        onFlag={handleCellRightClick}
      />

      <GameStatus gameStatus={gameStatus} />
    </main>
  );
}
