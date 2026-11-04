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

export default function PogoreletsElizaveta() {
  const [board, setBoard] = useState(() => createEmptyBoard());
  const [status, setStatus] = useState(GAME_STATUS.PROCESS);
  const [seconds, setSeconds] = useState(0);
  const [flagsCount, setFlagsCount] = useState(MINES_COUNT);
  const [isFirstClick, setIsFirstClick] = useState(true);

  useEffect(() => {
    if (isFirstClick || status !== GAME_STATUS.PROCESS) return undefined;

    const timerId = setInterval(() => {
      setSeconds((current) => current + 1);
    }, TIMER_INTERVAL_MS);

    return () => clearInterval(timerId);
  }, [isFirstClick, status]);

  const finishGame = (isWin, currentBoard) => {
    setStatus(isWin ? GAME_STATUS.WIN : GAME_STATUS.LOSE);
    setBoard(revealAllMines(currentBoard));
  };

  const checkWin = (currentBoard) => {
    const unopenedSafeCells = currentBoard
      .flat()
      .filter(
        (cell) =>
          cell.type !== CELL_TYPE.MINE &&
          cell.state !== CELL_STATE.OPENED
      ).length;

    if (unopenedSafeCells === 0) {
      finishGame(true, currentBoard);
    }
  };

  const openCell = (row, col) => {
    if (status !== GAME_STATUS.PROCESS) return;

    let workingBoard = board.map((boardRow) =>
      boardRow.map((cell) => ({ ...cell }))
    );

    const clickedCell = workingBoard[row][col];

    if (
      clickedCell.state === CELL_STATE.FLAGGED ||
      clickedCell.state === CELL_STATE.OPENED
    ) {
      return;
    }

    if (isFirstClick) {
      workingBoard = generateField(
        BOARD_ROWS,
        BOARD_COLS,
        MINES_COUNT,
        row,
        col
      );
      setIsFirstClick(false);
    }

    const cell = workingBoard[row][col];

    if (cell.type === CELL_TYPE.MINE) {
      cell.state = CELL_STATE.OPENED;
      cell.exploded = true;
      finishGame(false, workingBoard);
      return;
    }

    // Открываем клетку и, если она пустая, рекурсивно открываем соседей.
    const reveal = (currentRow, currentCol) => {
      if (
        currentRow < 0 ||
        currentRow >= BOARD_ROWS ||
        currentCol < 0 ||
        currentCol >= BOARD_COLS
      ) {
        return;
      }

      const currentCell = workingBoard[currentRow][currentCol];

      if (
        currentCell.state !== CELL_STATE.CLOSED ||
        currentCell.type === CELL_TYPE.MINE
      ) {
        return;
      }

      currentCell.state = CELL_STATE.OPENED;

      if (currentCell.neighborMines === 0) {
        for (let deltaRow = -1; deltaRow <= 1; deltaRow += 1) {
          for (let deltaCol = -1; deltaCol <= 1; deltaCol += 1) {
            if (deltaRow === 0 && deltaCol === 0) continue;
            reveal(currentRow + deltaRow, currentCol + deltaCol);
          }
        }
      }
    };

    reveal(row, col);
    setBoard(workingBoard);
    checkWin(workingBoard);
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
