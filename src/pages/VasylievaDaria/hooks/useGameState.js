
import { useCallback, useState } from 'react';

import { GAME_CONFIG, GAME_STATUS } from '../constants/game';
import { createBoard, placeMines } from '../utils/board';
import { revealCell } from '../utils/reveal';
import { checkWinCondition, revealAllMines } from '../utils/checks';

export function useGameState() {
  const [board, setBoard] = useState(createBoard);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.READY);
  const [gameNumber, setGameNumber] = useState(0);
  const [explodedCell, setExplodedCell] = useState(null);

  const flagsPlaced = board.flat().filter(cell => cell.flagged).length;
  const minesRemaining = GAME_CONFIG.MINES - flagsPlaced;

  const handleRestart = useCallback(() => {
    setBoard(createBoard());
    setGameStatus(GAME_STATUS.READY);
    setGameNumber(previousNumber => previousNumber + 1);
    setExplodedCell(null);
  }, []);

  const handleCellClick = useCallback((row, col) => {
    if (
      gameStatus === GAME_STATUS.WON ||
      gameStatus === GAME_STATUS.LOST
    ) {
      return;
    }

    if (board[row][col].opened || board[row][col].flagged) {
      return;
    }

    let nextBoard = board;

    if (gameStatus === GAME_STATUS.READY) {
      nextBoard = placeMines(board, row, col);
      setGameStatus(GAME_STATUS.PLAYING);
    }

    if (nextBoard[row][col].mine) {
      setExplodedCell({ row, col });
      setBoard(revealAllMines(nextBoard));
      setGameStatus(GAME_STATUS.LOST);
      return;
    }

    nextBoard = revealCell(nextBoard, row, col);

    if (checkWinCondition(nextBoard)) {
      setGameStatus(GAME_STATUS.WON);
    }

    setBoard(nextBoard);
  }, [board, gameStatus]);

  const handleCellRightClick = useCallback((row, col) => {
    if (
      gameStatus === GAME_STATUS.WON ||
      gameStatus === GAME_STATUS.LOST
    ) {
      return;
    }

    const currentCell = board[row][col];

    if (currentCell.opened) {
      return;
    }

    if (!currentCell.flagged && flagsPlaced >= GAME_CONFIG.MINES) {
      return;
    }

    const nextBoard = board.map((boardRow, currentRow) =>
      boardRow.map((cell, currentCol) => {
        if (currentRow === row && currentCol === col) {
          return { ...cell, flagged: !cell.flagged };
        }

        return cell;
      })
    );

    setBoard(nextBoard);
  }, [board, gameStatus, flagsPlaced]);

  return {
    board,
    gameStatus,
    gameNumber,
    explodedCell,
    minesRemaining,
    handleRestart,
    handleCellClick,
    handleCellRightClick,
  };
}
