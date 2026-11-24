import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Board from './components/Board.jsx';
import GameStatus from './components/GameStatus.jsx';
import RestartButton from './components/RestartButton.jsx';
import Timer from './components/Timer.jsx';
import { useMinesweeper } from './hooks/useMinesweeper.js';
import styles from './index.module.css';

export default function SurmachVolodymyr() {
  const { board, rows, cols, mineCount, flagsPlaced, seconds, status, reveal, toggleFlag, restart } = useMinesweeper();
  const [flagMode, setFlagMode] = useState(false);

  const handleReveal = useCallback((index) => {
    if (flagMode) toggleFlag(index);
    else reveal(index);
  }, [flagMode, reveal, toggleFlag]);

  const restartGame = useCallback(() => {
    setFlagMode(false);
    restart();
  }, [restart]);

  return (
    <div className={styles.page}>
      <div className={styles.appContainer}>
        <header className={styles.topPanel}>
          <div className={styles.ledDisplay} role="status" aria-live="polite" aria-label={`Remaining mines: ${mineCount - flagsPlaced}`}>
            <span className={styles.ledIcon} aria-hidden="true">💣</span>
            <span>{String(mineCount - flagsPlaced).padStart(3, '0')}</span>
          </div>
          <RestartButton status={status} onRestart={restartGame} className={styles.smileyButton} />
          <Timer seconds={seconds} className={styles.ledDisplay} iconClassName={styles.ledIcon} />
        </header>

        <GameStatus status={status} className={styles.statusMessage} />
        <Board
          board={board} rows={rows} cols={cols} status={status}
          onReveal={handleReveal} onToggleFlag={toggleFlag}
        />

        <footer className={styles.bottomNav}>
          <button type="button" className={styles.navItem} onClick={restartGame}>
            <span className={styles.navIcon} aria-hidden="true">➕</span>
            <span>New Game</span>
          </button>
          <button
            type="button"
            className={`${styles.navItem} ${flagMode ? styles.active : ''}`}
            aria-pressed={flagMode}
            onClick={() => setFlagMode((current) => !current)}
          >
            <span className={styles.navIcon} aria-hidden="true">🚩</span>
            <span>Flag</span>
          </button>
        </footer>
      </div>
      <p className={styles.help}>Left-click: open · Right-click / F: flag · Flag mode: tap to flag</p>
      <Link className={styles.backLink} to="/game">← Play Game</Link>
    </div>
  );
}
