import { GAME_STATUS } from './constants/game';
import { useGameState } from './hooks/useGameState';
import { useTimer } from './hooks/useTimer';
import Board from './components/Board';
import FlagsCounter from './components/FlagsCounter';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';
import Timer from './components/Timer';
import styles from './Game.module.css';


function ProkhorenkoMykyta() {
  const {
    board,
    status,
    gameTime,
    flagsLeft,
    config,
    revealCell,
    flagCell,
    tick,
    restart,
  } = useGameState();

  useTimer(status === GAME_STATUS.PROCESS, tick);

  return (
    <section
      className={styles.game}
      style={{ '--board-columns': config.cols }}
      aria-labelledby="prokhorenko-game-title"
    >
      <h1 id="prokhorenko-game-title" className={styles.title}>
        Сапер
      </h1>

      <header className={styles.statusBar}>
        <FlagsCounter flagsLeft={flagsLeft} />
        <RestartButton onRestart={restart} />
        <div className={styles.timerSlot}>
          <Timer seconds={gameTime} />
        </div>
      </header>

      <Board
        board={board}
        status={status}
        onReveal={revealCell}
        onFlag={flagCell}
      />

      <GameStatus status={status} gameTime={gameTime} />
    </section>
  );
}

export default ProkhorenkoMykyta;
