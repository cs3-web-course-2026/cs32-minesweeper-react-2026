import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Game.module.css';
import {
  DIFFICULTIES,
  CELL_TYPE,
  CELL_STATE,
  GAME_STATUS,
  createEmptyBoard,
  placeMinesAndCalculate,
  applyFloodFill,
  checkGameWon,
} from './gameUtils';

function DifficultyControls({ currentDifficulty, onSelectDifficulty }) {
  return (
    <div className={styles.difficultyButtons}>
      {Object.entries(DIFFICULTIES).map(([key, item]) => (
        <button
          key={key}
          type="button"
          className={`${styles.diffBtn} ${currentDifficulty === key ? styles.active : ''}`}
          onClick={() => onSelectDifficulty(key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function StatusPanel({ minesLeft, onRestart, gameTime, safeCellsLeft }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={styles.gameHeader}>
      <div className={styles.infoBox}>
        <span className={styles.infoLabel}>Mines:</span> {minesLeft}
      </div>
      <button type="button" className={styles.btnRestart} onClick={onRestart}>
        Restart
      </button>
      <div className={styles.infoBox}>
        <span className={styles.infoLabel}>Time:</span> {formatTime(gameTime)}
      </div>
      <div className={styles.infoBox}>
        <span className={styles.infoLabel}>Safe:</span> {safeCellsLeft}
      </div>
    </div>
  );
}

function GameBoard({ board, cols, onCellClick, onCellContextMenu }) {
  return (
    <div className={styles.boardWrapper}>
      <div
        className={styles.board}
        style={{ gridTemplateColumns: `repeat(${cols}, var(--cell-size))` }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            let content = '';
            const cellClasses = [styles.cell];

            let ariaLabel = `Row ${rowIndex + 1}, Column ${colIndex + 1}, `;
            if (cell.state === CELL_STATE.CLOSED) {
              ariaLabel += 'Closed cell';
            } else if (cell.state === CELL_STATE.FLAGGED) {
              ariaLabel += 'Flagged cell';
              cellClasses.push(styles.flagged);
              content = '🚩';
            } else if (cell.state === CELL_STATE.OPEN) {
              cellClasses.push(styles.revealed);
              if (cell.type === CELL_TYPE.MINE) {
                ariaLabel += 'Revealed mine';
                content = '💣';
              } else if (cell.neighborMines > 0) {
                ariaLabel += `Revealed cell, ${cell.neighborMines} adjacent mines`;
                content = cell.neighborMines;
                cellClasses.push(styles[`number${cell.neighborMines}`]);
              } else {
                ariaLabel += 'Revealed empty cell';
              }
            }

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                className={cellClasses.join(' ')}
                aria-label={ariaLabel}
                onClick={() => onCellClick(rowIndex, colIndex)}
                onContextMenu={(eventObject) => onCellContextMenu(eventObject, rowIndex, colIndex)}
              >
                {content}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function ResultModal({ modal, onRestart }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (modal.isOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [modal.isOpen]);

  if (!modal.isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalCard}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title">{modal.title}</h2>
        <div role="status" aria-live="polite">
          <p>{modal.message}</p>
        </div>
        <button
          ref={buttonRef}
          type="button"
          className={styles.btnAction}
          onClick={onRestart}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default function MinesweeperGame() {
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const { rows, cols, mines } = DIFFICULTIES[currentDifficulty];

  const [board, setBoard] = useState(() => createEmptyBoard(rows, cols));
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const [gameState, setGameState] = useState({
    rows,
    cols,
    minesCount: mines,
    status: GAME_STATUS.IDLE,
    gameTime: 0,
  });

  const initGame = useCallback((difficultyKey) => {
    const diff = DIFFICULTIES[difficultyKey];
    setCurrentDifficulty(difficultyKey);
    setBoard(createEmptyBoard(diff.rows, diff.cols));
    setGameState({
      rows: diff.rows,
      cols: diff.cols,
      minesCount: diff.mines,
      status: GAME_STATUS.IDLE,
      gameTime: 0,
    });
    setModal({ isOpen: false, title: '', message: '' });
    startTimeRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  useEffect(() => {
    if (gameState.status === GAME_STATUS.PROCESS) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setGameState((prev) => ({ ...prev, gameTime: elapsed }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.status]);

  const currentMinesLeft = board.reduce(
    (acc, row) => acc + row.filter((cell) => cell.state === CELL_STATE.FLAGGED).length,
    0
  );

  const totalSafeCells = rows * cols - mines;
  const openedSafeCells = board.flat().filter(
    (cell) => cell.type === CELL_TYPE.EMPTY && cell.state === CELL_STATE.OPEN
  ).length;
  const safeCellsLeft = totalSafeCells - openedSafeCells;

  const handleCellClick = (rowIndex, colIndex) => {
    if (gameState.status === GAME_STATUS.WIN || gameState.status === GAME_STATUS.GAMEOVER) return;

    let workingBoard = board;
    let currentStatus = gameState.status;

    if (currentStatus === GAME_STATUS.IDLE) {
      workingBoard = placeMinesAndCalculate(rows, cols, mines, rowIndex, colIndex, board);
      currentStatus = GAME_STATUS.PROCESS;
      startTimeRef.current = Date.now();
    }

    const targetCell = workingBoard[rowIndex][colIndex];
    if (targetCell.state === CELL_STATE.FLAGGED || targetCell.state === CELL_STATE.OPEN) return;

    if (targetCell.type === CELL_TYPE.MINE) {
      const revealedBoard = workingBoard.map((row) =>
        row.map((cell) => (cell.type === CELL_TYPE.MINE ? { ...cell, state: CELL_STATE.OPEN } : cell))
      );
      setBoard(revealedBoard);
      setGameState((prev) => ({ ...prev, status: GAME_STATUS.GAMEOVER }));
      setModal({
        isOpen: true,
        title: '💥 Game Over',
        message: 'Oops, you stepped on a mine!',
      });
      return;
    }

    const newBoard = applyFloodFill(workingBoard, rowIndex, colIndex, rows, cols);
    const hasWon = checkGameWon(newBoard);

    setBoard(newBoard);
    if (hasWon) {
      setGameState((prev) => ({ ...prev, status: GAME_STATUS.WIN }));
      setModal({
        isOpen: true,
        title: '🎉 Victory!',
        message: `You successfully cleared the minefield in ${gameState.gameTime} seconds!`,
      });
    } else {
      setGameState((prev) => ({ ...prev, status: currentStatus }));
    }
  };

  const handleCellContextMenu = (eventObject, rowIndex, colIndex) => {
    eventObject.preventDefault();
    if (gameState.status === GAME_STATUS.WIN || gameState.status === GAME_STATUS.GAMEOVER) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const targetCell = newBoard[rowIndex][colIndex];

    if (targetCell.state === CELL_STATE.OPEN) return;

    if (targetCell.state === CELL_STATE.FLAGGED) {
      targetCell.state = CELL_STATE.CLOSED;
    } else {
      if (currentMinesLeft >= mines) return;
      targetCell.state = CELL_STATE.FLAGGED;
    }

    setBoard(newBoard);
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.topBar}>
        <DifficultyControls
          currentDifficulty={currentDifficulty}
          onSelectDifficulty={initGame}
        />
        <StatusPanel
          minesLeft={mines - currentMinesLeft}
          onRestart={() => initGame(currentDifficulty)}
          gameTime={gameState.gameTime}
          safeCellsLeft={safeCellsLeft}
        />
      </div>

      <GameBoard
        board={board}
        cols={gameState.cols}
        onCellClick={handleCellClick}
        onCellContextMenu={handleCellContextMenu}
      />

      <ResultModal
        modal={modal}
        onRestart={() => initGame(currentDifficulty)}
      />
    </div>
  );
}