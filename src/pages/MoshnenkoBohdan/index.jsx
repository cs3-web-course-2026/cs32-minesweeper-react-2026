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

export default function MinesweeperGame() {
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const { rows, cols, mines } = DIFFICULTIES[currentDifficulty];

  const [board, setBoard] = useState(() => createEmptyBoard(rows, cols));
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

  const timerRef = useRef(null);
  const boardElementRef = useRef(null);

  const [gameState, setGameState] = useState({
    rows,
    cols,
    minesCount: mines,
    status: GAME_STATUS.IDLE,
    gameTime: 0,
  });

  // Ініціалізація / рестарт гри
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
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  // Керування таймером
  useEffect(() => {
    if (gameState.status === GAME_STATUS.PROCESS) {
      timerRef.current = setInterval(() => {
        setGameState((prev) => ({ ...prev, gameTime: prev.gameTime + 1 }));
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

  // Підрахунок прапорців
  const currentMinesLeft = board.reduce(
    (acc, row) => acc + row.filter((cell) => cell.state === CELL_STATE.FLAGGED).length,
    0
  );

  const safeCellsLeft = board.flat().filter(
    (cell) => cell.type === CELL_TYPE.EMPTY && cell.state !== CELL_STATE.OPEN
  ).length;

  // Обробка кліку по клітинці
  const handleCellClick = (r, c) => {
    if (gameState.status === GAME_STATUS.WIN || gameState.status === GAME_STATUS.GAMEOVER) return;

    let workingBoard = board;
    let currentStatus = gameState.status;

    if (currentStatus === GAME_STATUS.IDLE) {
      workingBoard = placeMinesAndCalculate(rows, cols, mines, r, c, board);
      currentStatus = GAME_STATUS.PROCESS;
    }

    const targetCell = workingBoard[r][c];
    if (targetCell.state === CELL_STATE.FLAGGED || targetCell.state === CELL_STATE.OPEN) return;

    if (targetCell.type === CELL_TYPE.MINE) {
      // Поразка: відкриваємо всі міни
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

    // Відкриття порожніх клітинок за допомогою винесеної утиліти
    const newBoard = applyFloodFill(workingBoard, r, c, rows, cols);
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

  // Встановлення прапорця (права кнопка миші)
  const handleContextMenu = (e, r, c) => {
    e.preventDefault();
    if (gameState.status === GAME_STATUS.WIN || gameState.status === GAME_STATUS.GAMEOVER) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const targetCell = newBoard[r][c];

    if (targetCell.state === CELL_STATE.OPEN) return;

    if (targetCell.state === CELL_STATE.FLAGGED) {
      targetCell.state = CELL_STATE.CLOSED;
    } else {
      if (currentMinesLeft >= mines) return;
      targetCell.state = CELL_STATE.FLAGGED;
    }

    setBoard(newBoard);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.topBar}>
        <div className={styles.difficultyButtons}>
          {Object.entries(DIFFICULTIES).map(([key, item]) => (
            <button
              key={key}
              type="button"
              className={`${styles.diffBtn} ${currentDifficulty === key ? styles.active : ''}`}
              onClick={() => initGame(key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.gameHeader}>
          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>Mines:</span> {mines - currentMinesLeft}
          </div>
          <button type="button" className={styles.btnRestart} onClick={() => initGame(currentDifficulty)}>
            Restart
          </button>
          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>Time:</span> {formatTime(gameState.gameTime)}
          </div>
          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>Safe:</span> {safeCellsLeft}
          </div>
        </div>
      </div>

      <div
        ref={boardElementRef}
        className={styles.board}
        style={{ gridTemplateColumns: `repeat(${gameState.cols}, var(--cell-size))` }}
      >
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            let content = '';
            const cellClasses = [styles.cell];

            if (cell.state === CELL_STATE.OPEN) {
              cellClasses.push(styles.revealed);
              if (cell.type === CELL_TYPE.MINE) {
                content = '💣';
              } else if (cell.neighborMines > 0) {
                content = cell.neighborMines;
                cellClasses.push(styles[`number${cell.neighborMines}`]);
              }
            } else if (cell.state === CELL_STATE.FLAGGED) {
              cellClasses.push(styles.flagged);
              content = '🚩';
            }

            return (
              <button
                key={`${rIdx}-${cIdx}`}
                type="button"
                className={cellClasses.join(' ')}
                onClick={() => handleCellClick(rIdx, cIdx)}
                onContextMenu={(e) => handleContextMenu(e, rIdx, cIdx)}
              >
                {content}
              </button>
            );
          })
        )}
      </div>

      {modal.isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h2>{modal.title}</h2>
            <p>{modal.message}</p>
            <button type="button" className={styles.btnAction} onClick={() => initGame(currentDifficulty)}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}