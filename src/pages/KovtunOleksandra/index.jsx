import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import RestartButton from './components/RestartButton';
import Timer from './components/Timer';
import FlagCounter from './components/FlagCounter';
import GameStatus from './components/GameStatus';
import { createInitialBoard, revealEmptyCells } from './utils/board';
import styles from './Game.module.css';

export default function KovtunOleksandra() {
  const [rows] = useState(10);
  const [cols] = useState(10);
  const [minesCount] = useState(15);
  
  const [board, setBoard] = useState(() => createInitialBoard(10, 10, 15));
  const [gameState, setGameState] = useState('process');
  const [flagsCount, setFlagsCount] = useState(15);
  const [gameTime, setGameTime] = useState(0);
  const [clickedMine, setClickedMine] = useState(null);
  const [activeCell, setActiveCell] = useState(null);

  const initGame = useCallback(() => {
    const newBoard = createInitialBoard(rows, cols, minesCount);
    setBoard(newBoard);
    setGameState('process');
    setFlagsCount(minesCount);
    setGameTime(0);
    setClickedMine(null);
    setActiveCell(null);
  }, [rows, cols, minesCount]);

  useEffect(() => {
    let timer = null;
    if (gameState === 'process') {
      timer = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const checkWin = (currentBoard) => {
    let closedSafe = 0;
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        if (currentBoard[rowIndex][colIndex].type !== 'mine' && currentBoard[rowIndex][colIndex].state !== 'opened') {
          closedSafe++;
        }
      }
    }
    if (closedSafe === 0) {
      setGameState('win');
    }
  };

  const openCell = (row, col, isOriginal = true) => {
    if (gameState !== 'process') return;
    if (isOriginal) {
      setActiveCell({ row, col });
    }

    const currentCell = board[row][col];
    if (currentCell.state === 'opened' || currentCell.state === 'flagged') return;

    if (currentCell.type === 'mine') {
      setClickedMine({ row, col });
      setGameState('lose');
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map(rowArray => rowArray.map(cell => ({ ...cell })));
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
          for (let colIndex = 0; colIndex < cols; colIndex++) {
            if (newBoard[rowIndex][colIndex].type === 'mine') {
              newBoard[rowIndex][colIndex].state = 'opened';
            }
          }
        }
        return newBoard;
      });
      return;
    }

    const newBoard = revealEmptyCells(board, row, col, rows, cols);
    setBoard(newBoard);

    if (isOriginal) {
      checkWin(newBoard);
    }
  };

  const toggleFlag = (event, row, col) => {
    event.preventDefault();
    if (gameState !== 'process') return;

    const cell = board[row][col];
    if (cell.state === 'opened') return;

    if (cell.state === 'closed' && flagsCount <= 0) return;

    const newFlagState = cell.state === 'closed' ? 'flagged' : 'closed';
    const flagChange = cell.state === 'closed' ? -1 : 1;

    setFlagsCount((prev) => prev + flagChange);

    setBoard((prevBoard) => {
      const newBoard = prevBoard.map(rowArray => rowArray.map(cellItem => ({ ...cellItem })));
      newBoard[row][col].state = newFlagState;
      return newBoard;
    });
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <h1>Minesweeper React</h1>
        <div className={styles.scoreboard}>
          <FlagCounter flagsCount={flagsCount} />
          <RestartButton gameState={gameState} initGame={initGame} />
          <Timer gameTime={gameTime} />
        </div>
      </div>

      <Board
        board={board}
        cols={cols}
        gameState={gameState}
        clickedMine={clickedMine}
        activeCell={activeCell}
        openCell={openCell}
        toggleFlag={toggleFlag}
      />

      <GameStatus gameState={gameState} gameTime={gameTime} />
    </div>
  );
}