import Board from './components/Board';
import FlagCounter from './components/FlagCounter';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';
import Timer from './components/Timer';
import { useMinesweeper } from './hooks/useMinesweeper';
import styles from './Game.module.css';

export default function IshchukDmytro() {
  const { board, status, seconds, flagsLeft, openCell, toggleFlag, restart } =
    useMinesweeper();
  return (
    <section className={styles.page} lang="uk" aria-label="Сапер">
      <div className={styles.game}>
        <header className={styles.header}>
          <FlagCounter flagsLeft={flagsLeft} />
          <RestartButton onRestart={restart} />
          <Timer seconds={seconds} />
        </header>
        <GameStatus status={status} />
        <Board
          board={board}
          onOpen={openCell}
          onFlag={toggleFlag}
        />
      </div>
    </section>
  );
}
