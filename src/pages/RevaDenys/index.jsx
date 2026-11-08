import React, { useState, useEffect, useCallback } from 'react';
import { generateField, checkWinCondition } from './utils/gameLogic';
import { Board } from './components/Board/Board';
import { Timer } from './components/Timer/Timer';
import { RestartButton } from './components/RestartButton/RestartButton';
import { GameStatus } from './components/GameStatus/GameStatus';
import styles from './index.module.css';

const GAME_CONFIG = { rows: 8, cols: 8, mines: 5 };

export default function RevaDenysGame() {
  const [board, setBoard] = useState(() =>
    generateField(GAME_CONFIG.rows, GAME_CONFIG.cols, GAME_CONFIG.mines),
  );
  const [status, setStatus] = useState('process'); // 'process' | 'win' | 'lose'
  const [time, setTime] = useState(0);

  const startNewGame = useCallback(() => {
    setBoard(
      generateField(GAME_CONFIG.rows, GAME_CONFIG.cols, GAME_CONFIG.mines),
    );
    setStatus('process');
    setTime(0);
  }, []);

  useEffect(() => {
    let timerId = null;

    if (status === 'process') {
      timerId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [status]);

  const flagsPlaced = board
    .flat()
    .filter((cell) => cell.state === 'flagged').length;
  const remainingMines = GAME_CONFIG.mines - flagsPlaced;

  const flagSign = remainingMines < 0 ? '-' : '';
  const formattedFlags = `${flagSign}${String(Math.abs(remainingMines)).padStart(3, '0')}`;

  const handleCellClick = (row, col) => {
    if (status !== 'process') return;

    setBoard((prevBoard) => {
      if (prevBoard[row][col].state !== 'closed') return prevBoard;

      const newBoard = prevBoard.map((r) => r.map((c) => ({ ...c })));

      const openRecursive = (r, c) => {
        if (r < 0 || r >= GAME_CONFIG.rows || c < 0 || c >= GAME_CONFIG.cols)
          return;
        if (newBoard[r][c].state !== 'closed') return;

        newBoard[r][c].state = 'opened';

        if (
          newBoard[r][c].neighborMines === 0 &&
          newBoard[r][c].type !== 'mine'
        ) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr !== 0 || dc !== 0) {
                openRecursive(r + dr, c + dc);
              }
            }
          }
        }
      };

      if (newBoard[row][col].type === 'mine') {
        newBoard[row][col].state = 'opened';
        setStatus('lose');
      } else {
        openRecursive(row, col);
        if (
          checkWinCondition(
            newBoard,
            GAME_CONFIG.rows,
            GAME_CONFIG.cols,
            GAME_CONFIG.mines,
          )
        ) {
          setStatus('win');
        }
      }

      return newBoard;
    });
  };

  const handleRightClick = (row, col) => {
    if (status !== 'process') return;

    setBoard((prevBoard) => {
      if (prevBoard[row][col].state === 'opened') return prevBoard;

      const newBoard = prevBoard.map((r) => r.map((c) => ({ ...c })));
      const targetCell = newBoard[row][col];

      if (targetCell.state === 'closed') {
        targetCell.state = 'flagged';
      } else if (targetCell.state === 'flagged') {
        targetCell.state = 'closed';
      }

      return newBoard;
    });
  };

  return (
    <main className={styles.vikingFrame}>
      <span
        className={`${styles.runeCorner} ${styles.topLeft}`}
        aria-hidden="true"
      >
        ᚠ
      </span>
      <span
        className={`${styles.runeCorner} ${styles.topRight}`}
        aria-hidden="true"
      >
        ᚦ
      </span>
      <span
        className={`${styles.runeCorner} ${styles.bottomLeft}`}
        aria-hidden="true"
      >
        ᛟ
      </span>
      <span
        className={`${styles.runeCorner} ${styles.bottomRight}`}
        aria-hidden="true"
      >
        ᛏ
      </span>

      <h1 className={styles.gameTitle}>MineSweeper</h1>

      <header className={styles.vikingHeader}>
        <div
          className={styles.stoneTracker}
          title="Залишилося ворожих пасток"
          role="status"
          aria-live="polite"
        >
          <span className={styles.trackerIcon} aria-hidden="true">
            🚩
          </span>
          <span
            className={styles.trackerValue}
            aria-label={`Залишилось пасток: ${remainingMines}`}
          >
            {formattedFlags}
          </span>
        </div>
        <RestartButton status={status} onClick={startNewGame} />

        <Timer value={time} />
      </header>

      {board.length > 0 && (
        <Board
          board={board}
          gameStatus={status}
          onCellClick={handleCellClick}
          onCellRightClick={handleRightClick}
        />
      )}

      <GameStatus status={status} />

      <footer className={styles.vikingFooter}>
        <span>Гарної гри</span>
      </footer>
    </main>
  );
}
