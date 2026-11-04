
import { useEffect, useRef, useState } from 'react';

import Board from './components/Board';
import Timer from './components/Timer';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';


import {
  generateField,
  revealCell,
  checkWin,
  toggleFlag,
  flagAllMines,
} from './utils/gameLogic';

import { GAME_STATUS } from './utils/constants';
import styles from './Game.module.css';

const ROWS = 9;
const COLS = 9;
const MINES_COUNT = 10;

function createInitialBoard() {
  return generateField(ROWS, COLS, MINES_COUNT);
}

function NikolchenkoMaria() {
  const [board, setBoard] = useState(createInitialBoard);
  const [status, setStatus] = useState(GAME_STATUS.READY);
  const [seconds, setSeconds] = useState(0);
  const [explodedCell, setExplodedCell] = useState(null);

  const startTimeRef = useRef(null);

  const flagsCount = board
    .flat()
    .filter((cell) => cell.state === 'flagged').length;

  // Оновлення таймера за фактично минулим часом
  useEffect(() => {
    if (status !== GAME_STATUS.PLAYING) {
      return undefined;
    }

    const timerId = setInterval(() => {
      if (startTimeRef.current !== null) {
        const elapsedSeconds = Math.floor(
          (Date.now() - startTimeRef.current) / 1000,
        );

        setSeconds(elapsedSeconds);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [status]);

  function handleOpen(row, col) {
    if (
      status === GAME_STATUS.WIN ||
      status === GAME_STATUS.LOSE ||
      board[row][col].state !== 'closed'
    ) {
      return;
    }

    let nextBoard;

    if (status === GAME_STATUS.READY) {
      startTimeRef.current = Date.now();

      const flaggedPositions = [];

      board.forEach((cells, flaggedRow) => {
        cells.forEach((cell, flaggedCol) => {
          if (cell.state === 'flagged') {
            flaggedPositions.push([flaggedRow, flaggedCol]);
          }
        });
      });

      // Перший хід завжди безпечний
      nextBoard = generateField(
        ROWS,
        COLS,
        MINES_COUNT,
        { row, col },
      );

      flaggedPositions.forEach(([flaggedRow, flaggedCol]) => {
        nextBoard[flaggedRow][flaggedCol].state = 'flagged';
      });

      setStatus(GAME_STATUS.PLAYING);
    } else {
      // Створюємо копію поля перед оновленням стану
      nextBoard = board.map((cells) =>
        cells.map((cell) => ({ ...cell })),
      );
    }

    const revealResult = revealCell(nextBoard, row, col);
    nextBoard = revealResult.field;
    const hitMine = revealResult.hitMine;

    if (hitMine) {
      setExplodedCell({ row, col });
      setStatus(GAME_STATUS.LOSE);
    } else if (checkWin(nextBoard)) {
    nextBoard = flagAllMines(nextBoard);
    setStatus(GAME_STATUS.WIN);
    }

    setBoard(nextBoard);
  }


  function handleFlag(row, col) {
  if (
      status === GAME_STATUS.WIN ||
      status === GAME_STATUS.LOSE
  ) {
      return;
  }

  setBoard((previousBoard) =>
      toggleFlag(previousBoard, row, col, MINES_COUNT),
  );
  }


  function handleRestart() {
    startTimeRef.current = null;

    setBoard(createInitialBoard());
    setStatus(GAME_STATUS.READY);
    setSeconds(0);
    setExplodedCell(null);
  }

  return (
    <section
      className={styles.game}
      aria-label="Гра Сапер"
    >
      <h1>Minesweeper</h1>

      <header className={styles.gameHeader}>
        <Timer seconds={seconds} />

        <RestartButton
          onRestart={handleRestart}
          status={status}
        />

        <div className={styles.gameInfo}>
          <span className={styles.label}>
            Прапорці
          </span>
          <span className={styles.value}>
            {flagsCount} / {MINES_COUNT}
          </span>
        </div>
      </header>

      <Board
        board={board}
        onOpen={handleOpen}
        onFlag={handleFlag}
        disabled={
          status === GAME_STATUS.WIN ||
          status === GAME_STATUS.LOSE
        }
        status={status}
        explodedCell={explodedCell}
      />

      <GameStatus status={status} />

      <p className={styles.gameHelp}>
        Ліва кнопка миші — відкрити клітинку.
        Права кнопка — встановити прапорець.
      </p>
    </section>
  );
}

export default NikolchenkoMaria;
