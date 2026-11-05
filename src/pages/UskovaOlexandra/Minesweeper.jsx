import { useState, useEffect } from 'react';

import GameHeader from './components/GameHeader';
import Board from './components/Board';
import GameStatus from './components/GameStatus';

import styles from './Minesweeper.module.css';

import {
  GAME_STATUS,
  CELL_STATE,
  createEmptyBoard,
  generateMinePositions,
  generateBoard,
  countNeighborMines,
  revealCells,
  checkWinCondition,
  finalizeBoard,
} from './utils/gameLogic';

// Game settings
const ROWS = 10;
const COLS = 10;
const MINES_COUNT = 15;

function Minesweeper() {
  // Game state
  const [board, setBoard] = useState(() => createEmptyBoard(ROWS, COLS));
  const [status, setStatus] = useState(GAME_STATUS.PROCESS);
  const [gameTime, setGameTime] = useState(0);
  const [flagsLeft, setFlagsLeft] = useState(MINES_COUNT);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [explodedMine, setExplodedMine] = useState(null);
  const [hasStartedAction, setHasStartedAction] = useState(false);

  // Timer (starts on first reveal or first flag)
  useEffect(() => {
    if (status !== GAME_STATUS.PROCESS || !hasStartedAction) {
      return;
    }

    const timerId = setInterval(() => {
      setGameTime(prevTime => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [status, hasStartedAction]);

  // Opening a cell
  function handleOpenCell(row, col) {
    if (status !== GAME_STATUS.PROCESS) {
      return;
    }

    if (
      board[row][col].state === CELL_STATE.OPENED ||
      board[row][col].state === CELL_STATE.FLAGGED
    ) {
      return;
    }

    setHasStartedAction(true);
    let currentBoard = board;

    // Generate the board on the first click, preserving any pre-placed flags
    if (isFirstClick) {
      const minePositions = generateMinePositions(ROWS, COLS, MINES_COUNT, row, col);

      currentBoard = generateBoard(ROWS, COLS, minePositions, row, col);
      currentBoard = currentBoard.map((boardRow, boardRowIndex) =>
        boardRow.map((cell, colIndex) => ({
          ...cell,
          state: board[boardRowIndex][colIndex].state,
        }))
      );
      currentBoard = countNeighborMines(currentBoard);
    }

    // Reveal the selected cell
    const result = revealCells(currentBoard, row, col);

    setBoard(result.newBoard);
    setIsFirstClick(false);

    // Check if the player hit a mine
    if (result.explodedMine) {
      setExplodedMine(result.explodedMine);
      setBoard(
        finalizeBoard(result.newBoard, GAME_STATUS.LOSE)
      );
      setStatus(GAME_STATUS.LOSE);
      return;
    }

    // Check if the player won
    if (checkWinCondition(result.newBoard, MINES_COUNT)) {
      setBoard(
        finalizeBoard(result.newBoard, GAME_STATUS.WIN)
      );
      setFlagsLeft(0);
      setStatus(GAME_STATUS.WIN);
    }
  }

  // Placing and removing flags
  function handleToggleFlag(row, col) {
    if (status !== GAME_STATUS.PROCESS) {
      return;
    }

    const cell = board[row][col];

    if (cell.state === CELL_STATE.OPENED) {
      return;
    }

    setHasStartedAction(true);
    const newBoard = board.map(boardRow =>
      boardRow.map(item => ({ ...item }))
    );

    // Place a flag
    if (cell.state === CELL_STATE.CLOSED) {
      if (flagsLeft <= 0) {
        return;
      }

      newBoard[row][col].state = CELL_STATE.FLAGGED;
      setBoard(newBoard);
      setFlagsLeft(prevFlags => prevFlags - 1);
    }
    // Remove a flag
    else if (cell.state === CELL_STATE.FLAGGED) {
      newBoard[row][col].state = CELL_STATE.CLOSED;
      setBoard(newBoard);
      setFlagsLeft(prevFlags => prevFlags + 1);
    }
  }

  // Restarting the game
  function handleRestart() {
    setBoard(createEmptyBoard(ROWS, COLS));
    setStatus(GAME_STATUS.PROCESS);
    setGameTime(0);
    setFlagsLeft(MINES_COUNT);
    setIsFirstClick(true);
    setExplodedMine(null);
    setHasStartedAction(false);
  }

  // Rendering the game
  return (
    <div className={styles.game}>
      <GameHeader
        time={gameTime}
        flagsLeft={flagsLeft}
        onRestart={handleRestart}
      />

      <main className={styles.main}>
        <Board
          board={board}
          onOpen={handleOpenCell}
          onFlag={handleToggleFlag}
          explodedMine={explodedMine}
          disabled={status !== GAME_STATUS.PROCESS}
          style={{ '--board-cols': board[0].length }}
        />

        <GameStatus status={status} />
      </main>
    </div>
  );
}

export default Minesweeper;