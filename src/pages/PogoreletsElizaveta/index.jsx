import { useEffect, useState } from "react";
import Board from "./components/Board";
import GameHeader from "./components/GameHeader";
import GameStatus from "./components/GameStatus";
import styles from "./Game.module.css";

import {
  BOARD_ROWS,
  BOARD_COLS,
  MINES_COUNT,
  TIMER_INTERVAL_MS,
  GAME_STATUS,
  CELL_STATE,
  CELL_TYPE,
  createEmptyBoard,
  generateField,
  revealAllMines,
} from "./constants/game";

import {
  revealCell,
  checkWinCondition,
} from "./constants/gameLogic";

export default function PogoreletsElizaveta() {
  const [board, setBoard] = useState(() => createEmptyBoard());
  const [status, setStatus] = useState(GAME_STATUS.PROCESS);
  const [seconds, setSeconds] = useState(0);
  const [flagsCount, setFlagsCount] = useState(MINES_COUNT);
  const [isFirstClick, setIsFirstClick] = useState(true);

  useEffect(() => {
    if (isFirstClick || status !== GAME_STATUS.PROCESS) {
      return undefined;
    }

    const timerId = setInterval(() => {
      setSeconds((current) => current + 1);
    }, TIMER_INTERVAL_MS);

    return () => clearInterval(timerId);
  }, [isFirstClick, status]);

  const finishGame = (isWin, currentBoard) => {
    setStatus(isWin ? GAME_STATUS.WIN : GAME_STATUS.LOSE);
    setBoard(revealAllMines(currentBoard));
  };

  const openCell = (row, col) => {
    if (status !== GAME_STATUS.PROCESS) return;

    let workingBoard = board;

    const clickedCell = workingBoard[row][col];

    if (
      clickedCell.state === CELL_STATE.FLAGGED ||
      clickedCell.state === CELL_STATE.OPENED
    ) {
      return;
    }

    if (isFirstClick) {
      const generatedBoard = generateField(
        BOARD_ROWS,
        BOARD_COLS,
        MINES_COUNT,
        row,
        col
      );

      // Сохраняем флажки, поставленные до первого клика.
      workingBoard = generatedBoard.map((boardRow, rowIndex) =>
        boardRow.map((cell, colIndex) => {
          if (
            board[rowIndex][colIndex].state === CELL_STATE.FLAGGED
          ) {
            return {
              ...cell,
              state: CELL_STATE.FLAGGED,
            };
          }

          return cell;
        })
      );

      setIsFirstClick(false);
    }

    const cell = workingBoard[row][col];

    if (cell.type === CELL_TYPE.MINE) {
      const lostBoard = workingBoard.map((boardRow) =>
        boardRow.map((currentCell) => ({ ...currentCell }))
      );

      lostBoard[row][col].state = CELL_STATE.OPENED;
      lostBoard[row][col].exploded = true;

      finishGame(false, lostBoard);
      return;
    }

    const revealedBoard = revealCell(workingBoard, row, col);

    setBoard(revealedBoard);

    if (checkWinCondition(revealedBoard)) {
      finishGame(true, revealedBoard);
    }
  };

  const toggleFlag = (row, col) => {
    if (status !== GAME_STATUS.PROCESS) return;

    const workingBoard = board.map((boardRow) =>
      boardRow.map((cell) => ({ ...cell }))
    );

    const cell = workingBoard[row][col];

    if (cell.state === CELL_STATE.OPENED) return;

    if (cell.state === CELL_STATE.FLAGGED) {
      cell.state = CELL_STATE.CLOSED;
      setFlagsCount((count) => count + 1);
    } else if (cell.state === CELL_STATE.CLOSED && flagsCount > 0) {
      cell.state = CELL_STATE.FLAGGED;
      setFlagsCount((count) => count - 1);
    } else {
      return;
    }

    setBoard(workingBoard);
  };

  const resetGame = () => {
    setBoard(createEmptyBoard(BOARD_ROWS, BOARD_COLS));
    setStatus(GAME_STATUS.PROCESS);
    setSeconds(0);
    setFlagsCount(MINES_COUNT);
    setIsFirstClick(true);
  };

  return (
    <div className={styles.page}>
      <section className={styles.gameContainer}>
        <h1 className={styles.title}>MINESWEEPER</h1>

        <GameHeader
          flagsCount={flagsCount}
          seconds={seconds}
          status={status}
          onRestart={resetGame}
        />

        <GameStatus status={status} />

        <Board
          board={board}
          onOpen={openCell}
          onToggleFlag={toggleFlag}
          disabled={status !== GAME_STATUS.PROCESS}
        />
      </section>
    </div>
  );
}