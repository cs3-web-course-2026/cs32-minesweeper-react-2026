import Board from './components/Board';
import GameStatus from './components/GameStatus';
import MineCounter from './components/MineCounter';
import RestartButton from './components/RestartButton';
import Timer from './components/Timer';
import { GAME_CONFIG } from './constants/game';
import { useGameState } from './hooks/useGameState';
import { useTimer } from './hooks/useTimer';

import styles from './Minesweeper.module.css';

function Minesweeper() {
  const {
    board,
    gameStatus,
    explodedCell,
    gameNumber,
    remainingMines,
    handleCellClick,
    handleCellFlag,
    handleRestart,
  } = useGameState();

  const elapsedSeconds = useTimer(gameStatus, gameNumber);

  return (
    <main className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>
        Сапер {GAME_CONFIG.ROWS}×{GAME_CONFIG.COLS}
      </h1>

      <section
        className={styles.minesweeperContainer}
        aria-label={`Гра Сапер ${GAME_CONFIG.ROWS} на ${GAME_CONFIG.COLS}`}
      >
        <header className={styles.gameHeader}>
          <MineCounter remainingMines={remainingMines} />
          <RestartButton gameStatus={gameStatus} onRestart={handleRestart} />
          <Timer seconds={elapsedSeconds} />
        </header>

        <GameStatus
          gameStatus={gameStatus}
          elapsedSeconds={elapsedSeconds}
          remainingMines={remainingMines}
        />

        <div className={styles.boardSection}>
          <Board
            board={board}
            gameStatus={gameStatus}
            explodedCell={explodedCell}
            onReveal={handleCellClick}
            onFlag={handleCellFlag}
          />
        </div>
      </section>

      <p className={styles.controlsHint}>
        Лівий клік — відкрити клітинку · Правий клік або клавіша F — прапорець
      </p>
    </main>
  );
}

export default Minesweeper;

