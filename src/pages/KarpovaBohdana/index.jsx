import { useGameState } from './hooks/useGameState';
import { useTimer } from './hooks/useTimer';
import { GAME_STATUS } from './constants/game';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import MineCounter from './components/MineCounter';
import RestartButton from './components/RestartButton';
import Timer from './components/Timer';

import styles from './Game.module.css';


function KarpovaBohdana() {
  const {
    board,
    status,
    gameTime,
    flagsLeft,
    isFinished,
    openCell,
    flagCell,
    restart,
    tick,
  } = useGameState();

  useTimer(status === GAME_STATUS.PLAYING, tick);

  return (
    <section className={styles.game} aria-labelledby="karpova-game-title">
      <h1 id="karpova-game-title" className={styles.title}>
        Сапер
      </h1>

      <header className={styles.statusBar}>
        <MineCounter flagsLeft={flagsLeft} />
        <RestartButton
          status={status}
          isFinished={isFinished}
          onRestart={restart}
        />
        <Timer seconds={gameTime} />
      </header>

      <Board
        board={board}
        isFinished={isFinished}
        onCellOpen={openCell}
        onCellFlag={flagCell}
      />

      <GameStatus status={status} isFinished={isFinished} />
    </section>
  );
}

export default KarpovaBohdana;
