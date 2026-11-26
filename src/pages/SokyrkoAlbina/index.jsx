import { useCallback, useEffect, useState } from 'react';
import Board from './components/Board';
import GameHeader from './components/GameHeader';
import GameModal from './components/GameModal';
import { CELL_STATE, GAME_CONFIG, MAX_TIME, STATUS } from './constants/gameConfig';
import {
  checkWin,
  createEmptyBoard,
  generateMinesOnBoard,
  isInside,
  revealCells,
} from './utils/boardUtils';
import styles from './Game.module.css';

export default function SokyrkoAlbina() {
  const { rows, cols, minesCount } = GAME_CONFIG;

  const [board, setBoard] = useState(() => createEmptyBoard(rows, cols));
  const [gameStatus, setGameStatus] = useState(STATUS.PROCESS);
  const [gameTime, setGameTime] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const flagsCount = board
    .flat()
    .filter((cell) => cell.state === CELL_STATE.FLAGGED).length;

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
        const explodedBoard = activeBoard.map((r) =>
          r.map((c) =>
            c.row === row && c.col === col ? { ...c, state: CELL_STATE.EXPLODED } : c
          )
        );
        setBoard(explodedBoard);
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
      if (gameStatus !== STATUS.PROCESS || !isInside(row, col, rows, cols)) {
        return;
      }

      const cell = board[row][col];
      if (cell.state === CELL_STATE.CLOSED && flagsCount >= minesCount) {
        return;
      }
      if (cell.state !== CELL_STATE.CLOSED && cell.state !== CELL_STATE.FLAGGED) {
        return;
      }

      const nextState =
        cell.state === CELL_STATE.CLOSED ? CELL_STATE.FLAGGED : CELL_STATE.CLOSED;

      setBoard((prevBoard) =>
        prevBoard.map((r) =>
          r.map((c) => (c.row === row && c.col === col ? { ...c, state: nextState } : c))
        )
      );
    },
    [board, flagsCount, gameStatus, minesCount, rows, cols]
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