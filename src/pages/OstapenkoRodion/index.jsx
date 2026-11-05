import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// Импорты дочерних компонентов (пути обновлены для корневого уровня)
import Board from './components/Board/Board';
import Display from './components/Display/Display';
import RestartButton from './components/RestartButton/RestartButton';
import GameStatus from './components/GameStatus/GameStatus';

// Импорты утилит и констант
import { GAME_CONFIG, GAME_STATUS, CELL_STATE, CELL_TYPE, TIMER_INTERVAL } from './constants';
import { 
  generateEmptyBoard, 
  cloneBoard, 
  placeMinesAndCalculate, 
  revealEmptyCells, 
  checkWinCondition, 
  revealMinesOnLoss, 
  flagMinesOnWin, 
  toggleFlagStatus 
} from './utils/gameLogic';

// Импорты стилей
import './index.css'; // или './main.css', в зависимости от названия вашего глобального файла
import styles from './Game.module.css';

const Game = () => {
  const [board, setBoard] = useState(() => generateEmptyBoard(GAME_CONFIG.ROWS, GAME_CONFIG.COLS));
  const [status, setStatus] = useState(GAME_STATUS.PROCESS);
  const [time, setTime] = useState(0);
  const [flags, setFlags] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  useEffect(() => {
    let timerId;
    if (status === GAME_STATUS.PROCESS && !isFirstClick) {
      timerId = setInterval(() => setTime(t => t + 1), TIMER_INTERVAL);
    }
    return () => clearInterval(timerId);
  }, [status, isFirstClick]);

  const initGame = useCallback(() => {
    setBoard(generateEmptyBoard(GAME_CONFIG.ROWS, GAME_CONFIG.COLS));
    setStatus(GAME_STATUS.PROCESS);
    setTime(0);
    setFlags(0);
    setIsFirstClick(true);
  }, []);

  const handleCellClick = (row, col) => {
    if (status !== GAME_STATUS.PROCESS || board[row][col].state === CELL_STATE.OPENED || board[row][col].state === CELL_STATE.FLAGGED) return;

    let nextBoard = isFirstClick 
      ? placeMinesAndCalculate(board, GAME_CONFIG.ROWS, GAME_CONFIG.COLS, GAME_CONFIG.MINES_COUNT, row, col)
      : cloneBoard(board);

    if (isFirstClick) setIsFirstClick(false);

    const cell = nextBoard[row][col];
    cell.state = CELL_STATE.OPENED;

    if (cell.type === CELL_TYPE.MINE) {
      cell.exploded = true;
      nextBoard = revealMinesOnLoss(nextBoard);
      setStatus(GAME_STATUS.LOSE);
      setBoard(nextBoard);
      return;
    }

    if (cell.neighborMines === 0) {
      nextBoard = revealEmptyCells(nextBoard, row, col);
    }

    if (checkWinCondition(nextBoard)) {
      setStatus(GAME_STATUS.WIN);
      nextBoard = flagMinesOnWin(nextBoard);
      setFlags(GAME_CONFIG.MINES_COUNT);
    }

    setBoard(nextBoard);
  };

  const handleCellRightClick = (row, col) => {
    if (status !== GAME_STATUS.PROCESS) return;
    const cellState = board[row][col].state;
    if (cellState === CELL_STATE.OPENED) return;

    if (cellState === CELL_STATE.CLOSED) setFlags(f => f + 1);
    else if (cellState === CELL_STATE.FLAGGED) setFlags(f => f - 1);

    setBoard(toggleFlagStatus(board, row, col));
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.topTitle}>SUPER MEGA</h1>

      <div className={styles.container}>
        <header className={styles.header}>
          <Display icon="🚩" value={GAME_CONFIG.MINES_COUNT - flags} />
          <RestartButton status={status} onRestart={initGame} />
          <Display icon="🕝" value={time} />
        </header>

        <GameStatus status={status} className={styles.statusMessage} />

        <Board 
          board={board} 
          onCellClick={handleCellClick} 
          onCellRightClick={handleCellRightClick} 
        />
      </div>
      
      <h1 className={styles.bottomTitle}>Minesweeper</h1>
    </div>
  );
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);