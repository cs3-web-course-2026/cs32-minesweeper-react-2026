
import { useEffect, useState } from 'react';
import Board from './components/Board';
import Timer from './components/Timer';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';
import styles from './Game.module.css';
import { GAME_STATUS } from './constants';
import revealCells from './utils/revealCells';

const SIZE = 10;
const MINES = 15;

function createBoard() {
  const board = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({
      isMine: false,
      revealed: false,
      flagged: false,
      adjacentMines: 0,
    }))
  );

  let placed = 0;

  while (placed < MINES) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);

    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      placed++;
    }
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c].isMine) continue;

      let count = 0;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;

          if (
            nr >= 0 &&
            nr < SIZE &&
            nc >= 0 &&
            nc < SIZE &&
            board[nr][nc].isMine
          ) {
            count++;
          }
        }
      }

      board[r][c].adjacentMines = count;
    }
  }

  return board;
}

function KupinNikita() {
  const [board, setBoard] = useState(createBoard);
  const [status, setStatus] = useState(GAME_STATUS.PLAYING);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || status !== GAME_STATUS.PLAYING) return;

    const interval = setInterval(() => {
      setTime((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [started, status]);

  function revealCell(row, col) {
    if (status !== GAME_STATUS.PLAYING) return;

    const current = board[row][col];

    if (current.revealed || current.flagged) return;

    setStarted(true);

    const next = revealCells(board, row, col);

    if (current.isMine) {
      next.forEach((line) =>
        line.forEach((cell) => {
          if (cell.isMine) {
            cell.revealed = true;
          }
        })
      );

      setStatus(GAME_STATUS.LOST);
    } else {
      const safeCells = next.flat().filter((cell) => !cell.isMine);
      const allSafeRevealed = safeCells.every((cell) => cell.revealed);

      if (allSafeRevealed) {
        setStatus(GAME_STATUS.WON);
      }
    }

    setBoard(next);
  }

  function toggleFlag(event, row, col) {
    event.preventDefault();

    if (status !== GAME_STATUS.PLAYING) return;

    const next = board.map((line) =>
      line.map((cell) => ({ ...cell }))
    );

    const cell = next[row][col];

    if (!cell.revealed) {
      cell.flagged = !cell.flagged;
      setBoard(next);
    }
  }

  function restartGame() {
    setBoard(createBoard());
    setStatus(GAME_STATUS.PLAYING);
    setTime(0);
    setStarted(false);
  }

  const flags = board.flat().filter((cell) => cell.flagged).length;

  return (
    <main className={styles.game}>
      <h1>Minesweeper React</h1>

      <div className={styles.info}>
        <span>💣 Міни: {MINES - flags}</span>
        <Timer time={time} />
      </div>

      <GameStatus status={status} />

      <Board
        board={board}
        onCellClick={revealCell}
        onCellRightClick={toggleFlag}
      />

      <RestartButton onRestart={restartGame} />
    </main>
  );
}

export default KupinNikita;
