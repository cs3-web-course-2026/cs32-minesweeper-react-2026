import { useState } from 'react';
import { Board } from './components/Board/Board';
import { Timer } from './components/Timer/Timer';
import { GameStatus } from './components/GameStatus/GameStatus';
import { RestartButton } from './components/RestartButton/RestartButton';
import styles from './Minesweeper.module.css';

const BOARD_SIZE = 10;
const MINES_COUNT = 10;

function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  );
}

function initializeBoard() {
  const board = createEmptyBoard();
  let placedMines = 0;

  while (placedMines < MINES_COUNT) {
    const r = Math.floor(Math.random() * BOARD_SIZE);
    const c = Math.floor(Math.random() * BOARD_SIZE);

    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      placedMines++;
    }
  }

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
            if (board[nr][nc].isMine) count++;
          }
        }
      }
      board[r][c].neighborMines = count;
    }
  }

  return board;
}

export default function MinesweeperGame() {
  const [board, setBoard] = useState(initializeBoard);
  const [status, setStatus] = useState('playing');
  const [timer, setTimer] = useState(0);

  const handleCellClick = (r, c) => {
    if (status !== 'playing' || board[r][c].isRevealed || board[r][c].isFlagged) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    if (newBoard[r][c].isMine) {
      newBoard.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isMine) cell.isRevealed = true;
        })
      );
      setBoard(newBoard);
      setStatus('lost');
      return;
    }

    const reveal = (row, col) => {
      if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;
      if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) return;

      newBoard[row][col].isRevealed = true;

      if (newBoard[row][col].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) reveal(row + dr, col + dc);
          }
        }
      }
    };

    reveal(r, c);

    let unrevealedNonMines = 0;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!newBoard[row][col].isMine && !newBoard[row][col].isRevealed) {
          unrevealedNonMines++;
        }
      }
    }

    setBoard(newBoard);

    if (unrevealedNonMines === 0) {
      setStatus('won');
    }
  };

  const handleCellContextMenu = (r, c) => {
    if (status !== 'playing' || board[r][c].isRevealed) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
  };

  const handleRestart = () => {
    setBoard(initializeBoard());
    setStatus('playing');
    setTimer(0);
  };

  return (
    <div className={styles.container}>
      <h2>Minesweeper — Prychyna Daria (CS-32)</h2>
      <div className={styles.header}>
        <GameStatus status={status} />
        <Timer seconds={timer} setSeconds={setTimer} isActive={status === 'playing'} />
        <RestartButton onRestart={handleRestart} />
      </div>
      <Board
        board={board}
        onCellClick={handleCellClick}
        onCellContextMenu={handleCellContextMenu}
      />
    </div>
  );
}