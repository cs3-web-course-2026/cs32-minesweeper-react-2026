import { useEffect, useState } from 'react';

import styles from './Game.module.css';
import Board from './components/Board';
import Timer from './components/Timer';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';

import {
  generateField,
  revealCell,
  checkWin,
} from './utils/gameLogic';

const ROWS = 9;
const COLS = 9;
const MINES_COUNT = 10;

function createInitialBoard() {
  return generateField(ROWS, COLS, MINES_COUNT);
}

function NikolchenkoMaria() {
  const [board, setBoard] = useState(createInitialBoard);
  const [status, setStatus] = useState('ready');
  const [seconds, setSeconds] = useState(0);
  const [explodedCell, setExplodedCell] = useState(null);

  const flagsCount = board.flat().filter(
    (cell) => cell.state === 'flagged',
  ).length;

  // Запускаємо таймер після першого відкриття клітинки
  useEffect(() => {
    if (status !== 'playing') {
      return undefined;
    }

    const timerId = setInterval(() => {
      setSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [status]);

  // Відкриття клітинки
  function handleOpen(row, col) {
    if (status === 'win' || status === 'lose') {
      return;
    }

    if (board[row][col].state !== 'closed') {
      return;
    }

    let nextBoard;

    if (status === 'ready') {
      // Зберігаємо прапорці, встановлені до першого ходу
      const flaggedPositions = [];

      board.forEach((cells, flaggedRow) => {
        cells.forEach((cell, flaggedCol) => {
          if (cell.state === 'flagged') {
            flaggedPositions.push([flaggedRow, flaggedCol]);
          }
        });
      });

      // Перша відкрита клітинка гарантовано безпечна
      nextBoard = generateField(
        ROWS,
        COLS,
        MINES_COUNT,
        { row, col },
      );

      flaggedPositions.forEach(([flaggedRow, flaggedCol]) => {
        nextBoard[flaggedRow][flaggedCol].state = 'flagged';
      });

      setStatus('playing');
    } else {
      // Створюємо копію поля перед зміною стану
      nextBoard = board.map((cells) =>
        cells.map((cell) => ({ ...cell })),
      );
    }

    const hitMine = revealCell(nextBoard, row, col);

    if (hitMine) {
      setExplodedCell({ row, col });
      setStatus('lose');
    } else if (checkWin(nextBoard)) {
      // Після перемоги автоматично позначаємо всі міни
      nextBoard.forEach((cells) => {
        cells.forEach((cell) => {
          if (cell.type === 'mine') {
            cell.state = 'flagged';
          }
        });
      });

      setStatus('win');
    }

    setBoard(nextBoard);
  }

  // Встановлення та зняття прапорця
  function handleFlag(row, col) {
    if (status === 'win' || status === 'lose') {
      return;
    }

    const cell = board[row][col];

    if (cell.state === 'opened') {
      return;
    }

    if (
      cell.state === 'closed' &&
      flagsCount >= MINES_COUNT
    ) {
      return;
    }

    const nextBoard = board.map((cells) =>
      cells.map((currentCell) => ({ ...currentCell })),
    );

    nextBoard[row][col].state =
      cell.state === 'flagged' ? 'closed' : 'flagged';

    setBoard(nextBoard);
  }

  // Початок нової гри
  function handleRestart() {
    setBoard(createInitialBoard());
    setStatus('ready');
    setSeconds(0);
    setExplodedCell(null);
  }

return (
  <main className={styles.game}>
    <h1>Minesweeper</h1>

    <div className={styles.gameHeader}>
      <Timer seconds={seconds} />

      <RestartButton
        onRestart={handleRestart}
        status={status}
      />

      <div className={styles.gameInfo}>
        <span className={styles.label}>Прапорці</span>
        <span className={styles.value}>
          {flagsCount} / {MINES_COUNT}
        </span>
      </div>
    </div>

    <Board
      board={board}
      onOpen={handleOpen}
      onFlag={handleFlag}
      disabled={status === 'win' || status === 'lose'}
      status={status}
      explodedCell={explodedCell}
    />

    <GameStatus status={status} />

    <p className={styles.gameHelp}>
      Ліва кнопка миші — відкрити клітинку.
      Права кнопка — встановити прапорець.
    </p>
  </main>
);
}

export default NikolchenkoMaria;