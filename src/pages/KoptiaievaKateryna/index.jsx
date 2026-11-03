import Board from './components/Board';
import FlagCounter from './components/FlagCounter';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';
import Timer from './components/Timer';
import { useGameState } from './hooks/useGameState';

import styles from './Game.module.css';


function KoptiaievaKateryna() {
  const { board, status, gameTime, flagsLeft, openCell, flagCell, restart } =
    useGameState();

  return (
    <div className={styles.page}>
      <section className={styles.game} aria-labelledby="minesweeper-title">
        <h1 id="minesweeper-title" className={styles.title}>
          Minesweeper
        </h1>

        <header className={styles.header}>
          <FlagCounter flagsLeft={flagsLeft} />
          <RestartButton status={status} onRestart={restart} />
          <Timer gameTime={gameTime} />
        </header>

        <Board
          board={board}
          status={status}
          onOpenCell={openCell}
          onFlagCell={flagCell}
        />

        <GameStatus status={status} />
      </section>
    </div>
  );
}


export default KoptiaievaKateryna;
