import { useEffect, useState } from 'react';

import Board from './components/Board';
import Header from './components/Header';
import GameStatus from './components/GameStatus';

import styles from './Game.module.css';

const ROWS = 8;
const COLS = 8;
const MINES = 10;

function createBoard() {
  const board = [];

  for (let r = 0; r < ROWS; r++) {
    const row = [];

    for (let c = 0; c < COLS; c++) {
      row.push({
        type: 'empty',
        neighborMines: 0,
        state: 'closed',
        exploded: false,
      });
    }

    board.push(row);
  }

  let minesPlaced = 0;

  while (minesPlaced < MINES) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);

    if (board[row][col].type !== 'mine') {
      board[row][col].type = 'mine';
      minesPlaced++;
    }
  }

  return board;
}

function getNeighbors(row, col) {
  const neighbors = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      const nr = row + dr;
      const nc = col + dc;

      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        neighbors.push({ row: nr, col: nc });
      }
    }
  }

  return neighbors;
}

function fillNumbers(board) {
  const newBoard = structuredClone(board);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (newBoard[r][c].type === 'mine') continue;

      let count = 0;

      getNeighbors(r, c).forEach(({ row, col }) => {
        if (newBoard[row][col].type === 'mine') {
          count++;
        }
      });

      newBoard[r][c].neighborMines = count;
    }
  }

  return newBoard;
}

export default function PavlovaSofiia() {
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState('process');
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (gameStatus !== 'process') return;

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, gameStatus]);

  const initGame = () => {
    const generatedBoard = fillNumbers(createBoard());

    setStarted(false);
    setBoard(generatedBoard);
    setTime(0);
    setGameStatus('process');
  };

  const revealCell = (row, col, boardCopy) => {
    const cell = boardCopy[row][col];

    if (cell.state !== 'closed') return;

    cell.state = 'opened';

    if (cell.neighborMines === 0) {
      getNeighbors(row, col).forEach(({ row, col }) => {
        revealCell(row, col, boardCopy);
      });
    }
  };

  const checkWin = (boardCopy) => {
    let closedSafeCells = 0;

    boardCopy.forEach((row) => {
      row.forEach((cell) => {
        if (cell.type !== 'mine' && cell.state !== 'opened') {
          closedSafeCells++;
        }
      });
    });

    if (closedSafeCells === 0) {
      setGameStatus('win');
    }
  };

  const openCell = (row, col) => {
    if (gameStatus !== 'process') return;

    if (!started) {
      setStarted(true);
    }

    const boardCopy = structuredClone(board);
    const cell = boardCopy[row][col];

    if (cell.state === 'flagged') return;

    if (cell.type === 'mine') {
      cell.state = 'opened';
      cell.exploded = true;

      boardCopy.forEach((row) =>
        row.forEach((cell) => {
          if (cell.type === 'mine') {
            cell.state = 'opened';
          }
        }),
      );

      setBoard(boardCopy);
      setGameStatus('lose');
      return;
    }

    revealCell(row, col, boardCopy);

    setBoard(boardCopy);
    checkWin(boardCopy);
  };

  const toggleFlag = (row, col) => {
    if (gameStatus !== 'process') return;

    const boardCopy = structuredClone(board);
    const cell = boardCopy[row][col];

    if (cell.state === 'opened') return;

    cell.state = cell.state === 'flagged' ? 'closed' : 'flagged';

    setBoard(boardCopy);
  };

  const flagsCount = board
    .flat()
    .filter((cell) => cell.state === 'flagged').length;

  return (
    <div className={styles.game}>
      <Header time={time} flags={MINES - flagsCount} onRestart={initGame} />

      <GameStatus status={gameStatus} time={time} />

      <Board board={board} onOpen={openCell} onFlag={toggleFlag} />
    </div>
  );
}
