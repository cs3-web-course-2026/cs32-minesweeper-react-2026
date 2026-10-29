import { useState, useEffect, useCallback } from 'react';
import {
  ROWS,
  COLS,
  MINES_COUNT,
  GAME_STATUS,
  CELL_STATE,
  CELL_TYPE,
} from './constants/game';
import {
  generateField,
  countNeighbourMines,
  floodFillReveal,
  checkWinCondition,
} from './utils/board';
import Board from './components/Board';
import Timer from './components/Timer';
import FlagCounter from './components/FlagCounter';
import RestartButton from './components/RestartButton';
import GameStatus from './components/GameStatus';
import styles from './Game.module.css';

function ChernousValerii() {
  const [board, setBoard] = useState(() =>
    countNeighbourMines(generateField(ROWS, COLS, MINES_COUNT)),
  );
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PROCESS);
  const [gameTime, setGameTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [explodedCell, setExplodedCell] = useState(null);

  // Таймер
  useEffect(() => {
    let intervalId = null;
    if (timerActive && gameStatus === GAME_STATUS.PROCESS) {
      intervalId = setInterval(() => {
        setGameTime((previousTime) => previousTime + 1);
      }, 1000);
    }
    return () => {
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [timerActive, gameStatus]);

  // Підрахунок встановлених прапорців
  const placedFlagsCount = board.reduce(
    (total, rowCells) =>
      total +
      rowCells.filter((cell) => cell.state === CELL_STATE.FLAGGED).length,
    0,
  );
  const remainingFlags = MINES_COUNT - placedFlagsCount;

  // Рестарт гри
  const handleRestart = useCallback(() => {
    setBoard(countNeighbourMines(generateField(ROWS, COLS, MINES_COUNT)));
    setGameStatus(GAME_STATUS.PROCESS);
    setGameTime(0);
    setTimerActive(false);
    setExplodedCell(null);
  }, []);

  // Відкриття клітинки
  const handleCellClick = useCallback(
    (row, col) => {
      if (gameStatus !== GAME_STATUS.PROCESS) return;

      const currentCell = board[row][col];
      if (
        currentCell.state === CELL_STATE.OPENED ||
        currentCell.state === CELL_STATE.FLAGGED
      ) {
        return;
      }

      if (!timerActive) {
        setTimerActive(true);
      }

      // Клік на міну -> поразка
      if (currentCell.type === CELL_TYPE.MINE) {
        setExplodedCell({ row, col });
        setGameStatus(GAME_STATUS.LOSE);
        setTimerActive(false);

        // Відкриваємо лише закриті міни, прапорці залишаються
        setBoard((previousBoard) =>
          previousBoard.map((rowCells) =>
            rowCells.map((cell) => {
              if (
                cell.type === CELL_TYPE.MINE &&
                cell.state === CELL_STATE.CLOSED
              ) {
                return { ...cell, state: CELL_STATE.OPENED };
              }
              return cell;
            }),
          ),
        );
        return;
      }

      // Чиста функція каскадного відкриття
      const newBoard = floodFillReveal(board, row, col);

      // Перевірка умови перемоги
      if (checkWinCondition(newBoard, MINES_COUNT)) {
        setGameStatus(GAME_STATUS.WIN);
        setTimerActive(false);

        // Автоматично позначаємо всі міни прапорцями при перемозі
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (newBoard[r][c].type === CELL_TYPE.MINE) {
              newBoard[r][c].state = CELL_STATE.FLAGGED;
            }
          }
        }
      }

      setBoard(newBoard);
    },
    [board, gameStatus, timerActive],
  );

  // Встановлення / зняття прапорця
  const handleCellContextMenu = useCallback(
    (event, row, col) => {
      event.preventDefault();
      if (gameStatus !== GAME_STATUS.PROCESS) return;

      const cell = board[row][col];
      if (cell.state === CELL_STATE.OPENED) return;

      if (!timerActive) {
        setTimerActive(true);
      }

      setBoard((previousBoard) => {
        const currentlyFlagged = previousBoard.reduce(
          (sum, r) =>
            sum + r.filter((c) => c.state === CELL_STATE.FLAGGED).length,
          0,
        );

        return previousBoard.map((rowCells, rIndex) =>
          rowCells.map((cCell, cIndex) => {
            if (rIndex === row && cIndex === col) {
              if (cCell.state === CELL_STATE.CLOSED) {
                if (currentlyFlagged < MINES_COUNT) {
                  return { ...cCell, state: CELL_STATE.FLAGGED };
                }
                return cCell;
              }
              if (cCell.state === CELL_STATE.FLAGGED) {
                return { ...cCell, state: CELL_STATE.CLOSED };
              }
            }
            return cCell;
          }),
        );
      });
    },
    [board, gameStatus, timerActive],
  );

  // Керування з клавіатури (Space для прапорця)
  const handleCellKeyDown = useCallback(
    (event, row, col) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        handleCellContextMenu(event, row, col);
      }
    },
    [handleCellContextMenu],
  );

  return (
    <div className={styles.gameContainer}>
      {/* Хедер гри */}
      <header className={styles.gameHeader}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <h1 className={styles.headerName}>
            <span>Mine</span>sweeper
          </h1>

          <div className={styles.headerStats}>
            <Timer time={gameTime} />
            <RestartButton
              gameStatus={gameStatus}
              onRestart={handleRestart}
            />
            <FlagCounter remainingFlags={remainingFlags} />
          </div>
        </div>
      </header>

      {/* Основна частина гри */}
      <main className={styles.gameMain}>
        <div className={styles.boardFrame}>
          <GameStatus gameStatus={gameStatus} />
          <Board
            board={board}
            gameStatus={gameStatus}
            explodedCell={explodedCell}
            onCellClick={handleCellClick}
            onCellContextMenu={handleCellContextMenu}
            onCellKeyDown={handleCellKeyDown}
          />
        </div>
      </main>
    </div>
  );
}

export default ChernousValerii;
