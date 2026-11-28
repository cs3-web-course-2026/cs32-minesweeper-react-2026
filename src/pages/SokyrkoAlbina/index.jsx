import { useCallback, useEffect, useState } from 'react';
import Board from './components/Board';
import GameHeader from './components/GameHeader';
import GameModal from './components/GameModal';
import { CELL_STATE, GAME_CONFIG, MAX_TIME, STATUS } from './constants/gameConfig';
import {
  checkWin,
  countFlaggedCells,
  createEmptyBoard,
  explodeCell,
  generateMinesOnBoard,
  isInside,
  revealCells,
  toggleCellFlag,
} from './utils/boardUtils';
import styles from './Game.module.css';

export default function SokyrkoAlbina() {
  const { rows, cols, minesCount } = GAME_CONFIG;

  const [board, setBoard] = useState(() => createEmptyBoard(rows, cols));
  const [gameStatus, setGameStatus] = useState(STATUS.PROCESS);
  const [gameTime, setGameTime] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const flagsCount = countFlaggedCells(board);

  useEffect(() => {
    if (gameStatus !== STATUS.PROCESS || isFirstClick) {
      return undefined;
    }

    const timerId = setInterval(() => {
      setGameTime((prev) => Math.min(prev + 1, MAX_TIME));
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameStatus, isFirstClick]);

  const handleRestart = useCallback(() => {
    setIsModalOpen(false);
    setGameStatus(STATUS.PROCESS);
    setGameTime(0);
    setIsFirstClick(true);
    setBoard(createEmptyBoard(rows, cols));
  }, [rows, cols]);

  const handleOpenCell = useCallback(
    (row, col) => {
      if (gameStatus !== STATUS.PROCESS || !isInside(row, col, rows, cols)) {
        return;
      }

      const targetCell = board[row][col];
      if (targetCell.state !== CELL_STATE.CLOSED) {
        return;
      }

      let activeBoard = board;
      if (isFirstClick) {
        activeBoard = generateMinesOnBoard(board, minesCount, row, col);
        setIsFirstClick(false);
      }

      const clickedCell = activeBoard[row][col];
      if (clickedCell.type === 'mine') {
        setBoard(explodeCell(activeBoard, row, col));
        setGameStatus(STATUS.LOSE);
        setIsModalOpen(true);
        return;
      }

      const revealedBoard = revealCells(activeBoard, row, col);
      setBoard(revealedBoard);

      if (checkWin(revealedBoard, minesCount)) {
        setGameStatus(STATUS.WIN);
        setIsModalOpen(true);
      }
    },
    [board, gameStatus, isFirstClick, minesCount, rows, cols]
  );

  const handleToggleFlag = useCallback(
    (row, col) => {
      if (gameStatus !== STATUS.PROCESS) {
        return;
      }

      const nextBoard = toggleCellFlag(board, row, col, minesCount);
      if (nextBoard) {
        setBoard(nextBoard);
      }
    },
    [board, gameStatus, minesCount]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.gameContainer}>
        <GameHeader
          flagsLeft={minesCount - flagsCount}
          gameTime={gameTime}
          gameStatus={gameStatus}
          onRestart={handleRestart}
        />

        <Board
          board={board}
          cols={cols}
          gameStatus={gameStatus}
          onOpenCell={handleOpenCell}
          onToggleFlag={handleToggleFlag}
        />

        <GameModal
          gameStatus={gameStatus}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </main>
    </div>
  );
}