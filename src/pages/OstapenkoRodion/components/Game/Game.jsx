import React, { useState, useEffect, useCallback } from 'react';
import Board from '../Board/Board';
import Display from '../Display/Display';
import RestartButton from '../RestartButton/RestartButton';
import GameStatus from '../GameStatus/GameStatus';
import styles from './Game.module.css';
import { GAME_CONFIG } from '../../constants';
import { generateEmptyBoard, placeMinesAndCalculate, revealEmptyCells, checkWinCondition } from '../../utils/gameLogic';

const Game = () => {
  const [board, setBoard] = useState(() => generateEmptyBoard(GAME_CONFIG.ROWS, GAME_CONFIG.COLS));
  const [status, setStatus] = useState('process'); // 'process', 'win', 'lose'
  const [time, setTime] = useState(0);
  const [flags, setFlags] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  // Таймер
  useEffect(() => {
    let timerId;
    if (status === 'process' && !isFirstClick) {
      timerId = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(timerId);
  }, [status, isFirstClick]);

  const initGame = useCallback(() => {
    setBoard(generateEmptyBoard(GAME_CONFIG.ROWS, GAME_CONFIG.COLS));
    setStatus('process');
    setTime(0);
    setFlags(0);
    setIsFirstClick(true);
  }, []);

  const handleCellClick = (r, c) => {
    if (status !== 'process' || board[r][c].state === 'opened' || board[r][c].state === 'flagged') return;

    let currentBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (isFirstClick) {
      currentBoard = placeMinesAndCalculate(currentBoard, GAME_CONFIG.ROWS, GAME_CONFIG.COLS, GAME_CONFIG.MINES_COUNT, r, c);
      setIsFirstClick(false);
    }

    const cell = currentBoard[r][c];
    cell.state = 'opened';

    if (cell.type === 'mine') {
      cell.exploded = true;
      setStatus('lose');
      // Відкриваємо всі міни
      currentBoard.forEach(row => row.forEach(c => {
        if (c.type === 'mine' && c.state !== 'flagged') c.state = 'opened';
        if (c.state === 'flagged' && c.type !== 'mine') c.state = 'wrong-flag';
      }));
    } else {
      if (cell.neighborMines === 0) {
        revealEmptyCells(currentBoard, r, c);
      }
      if (checkWinCondition(currentBoard)) {
        setStatus('win');
        // Ставимо прапорці на всі невідкриті міни
        currentBoard.forEach(row => row.forEach(c => {
          if (c.type === 'mine') c.state = 'flagged';
        }));
        setFlags(GAME_CONFIG.MINES_COUNT);
      }
    }

    setBoard(currentBoard);
  };

  const handleCellRightClick = (r, c) => {
    if (status !== 'process') return;
    
    const currentBoard = [...board.map(row => [...row])];
    const cell = currentBoard[r][c];

    if (cell.state === 'opened') return;

    if (cell.state === 'closed') {
      cell.state = 'flagged';
      setFlags(f => f + 1);
    } else if (cell.state === 'flagged') {
      cell.state = 'closed';
      setFlags(f => f - 1);
    }

    setBoard(currentBoard);
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

export default Game;