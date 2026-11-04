import { useEffect, useState } from 'react';
import Board from './components/Board';
import GameHeader from './components/GameHeader';
import GameStatus from './components/GameStatus';
import { BOARD_CONFIG, CELL_STATE, CELL_TYPE, GAME_STATUS, TIMER_INTERVAL_MS } from './constants/gameConstants';
import { checkIsWin, cloneBoard, createInitialBoard, revealCellRecursive, processCellOpen } from './utils/gameHelpers';
import styles from './KhomiakovOleksii.module.css';

export default function KhomiakovOleksii() {
  const [board, setBoard] = useState(() =>
    createInitialBoard(BOARD_CONFIG.ROWS, BOARD_CONFIG.COLS, BOARD_CONFIG.MINES)
  );
  const [status, setStatus] = useState(GAME_STATUS.PROCESS);
  const [flagsCount, setFlagsCount] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (!startTime || status !== GAME_STATUS.PROCESS) return undefined;

    const timerId = setInterval(() => {
      setGameTime(Math.floor((Date.now() - startTime) / 1000));
    }, TIMER_INTERVAL_MS);

    return () => clearInterval(timerId);
  }, [startTime, status]);

  const handleOpenCell = (rowIndex, colIndex) => {
    if (status !== GAME_STATUS.PROCESS) return;

    const currentCell = board[rowIndex][colIndex];
    if (currentCell.state === CELL_STATE.OPENED || currentCell.state === CELL_STATE.FLAGGED) return;

    if (!startTime) setStartTime(Date.now());

    const { nextBoard, isLose, isWin } = processCellOpen(board, rowIndex, colIndex);
    setBoard(nextBoard);

    if (isLose) {
      setStatus(GAME_STATUS.LOSE);
    } else if (isWin) {
      setStatus(GAME_STATUS.WIN);
    }
  };

  const handleToggleFlag = (rowIndex, colIndex) => {
    if (status !== GAME_STATUS.PROCESS) return;

    const currentCell = board[rowIndex][colIndex];
    if (currentCell.state === CELL_STATE.OPENED) return;

    if (!startTime) setStartTime(Date.now());

    const nextBoard = cloneBoard(board);
    const targetCell = nextBoard[rowIndex][colIndex];

    if (targetCell.state === CELL_STATE.CLOSED) {
      if (flagsCount >= BOARD_CONFIG.MINES) return;
      targetCell.state = CELL_STATE.FLAGGED;
      setFlagsCount((prev) => prev + 1);
    } else if (targetCell.state === CELL_STATE.FLAGGED) {
      targetCell.state = CELL_STATE.CLOSED;
      setFlagsCount((prev) => prev - 1);
    }

    setBoard(nextBoard);
  };

  const handleRestart = () => {
    setStartTime(null);
    setStatus(GAME_STATUS.PROCESS);
    setFlagsCount(0);
    setGameTime(0);
    setBoard(createInitialBoard(BOARD_CONFIG.ROWS, BOARD_CONFIG.COLS, BOARD_CONFIG.MINES));
  };

  const minesLeft = BOARD_CONFIG.MINES - flagsCount;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.minesweeperApp}>
        <GameHeader
          minesLeft={minesLeft}
          gameTime={gameTime}
          status={status}
          onRestart={handleRestart}
        />
        <GameStatus status={status} />
        <Board
          board={board}
          gameStatus={status}
          onOpenCell={handleOpenCell}
          onToggleFlag={handleToggleFlag}
        />
      </div>
    </div>
  );
}