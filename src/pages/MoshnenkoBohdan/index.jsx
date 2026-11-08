import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Game.module.css';

// Константи та доменні значення згідно з вимогами курсу
const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10, label: 'Easy' },
  medium: { rows: 16, cols: 16, mines: 40, label: 'Medium' },
  hard: { rows: 16, cols: 30, mines: 99, label: 'Hard' },
};

const CELL_TYPE = {
  EMPTY: 'empty',
  MINE: 'mine',
};

const CELL_STATE = {
  CLOSED: 'closed',
  OPEN: 'open',
  FLAGGED: 'flagged',
};

const GAME_STATUS = {
  IDLE: 'idle',
  PROCESS: 'process',
  WIN: 'win',
  GAMEOVER: 'gameover',
};

// Чисті функції для бізнес-логіки гри (без прямої залежності від React)
const createEmptyBoard = (rows, cols) => {
  const newBoard = [];
  for (let r = 0; r < rows; r++) {
    newBoard[r] = [];
    for (let c = 0; c < cols; c++) {
      newBoard[r][c] = {
        row: r,
        col: c,
        type: CELL_TYPE.EMPTY,
        state: CELL_STATE.CLOSED,
        neighborMines: 0,
      };
    }
  }
  return newBoard;
};

const placeMinesAndCalculate = (rows, cols, minesCount, clickedRow, clickedCol, currentBoard) => {
  const newBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell })));
  let planted = 0;

  while (planted < minesCount) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    // Забезпечуємо безпечний перший клік (не ставимо міну на клітинку кліку та навколо неї)
    const isNearStart = Math.abs(randomRow - clickedRow) <= 1 && Math.abs(randomCol - clickedCol) <= 1;

    if (newBoard[randomRow][randomCol].type !== CELL_TYPE.MINE && !isNearStart) {
      newBoard[randomRow][randomCol].type = CELL_TYPE.MINE;
      planted++;
    }
  }

  // Підрахунок сусідніх мін
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (newBoard[row][col].type === CELL_TYPE.MINE) continue;
      let counter = 0;
      const left = Math.max(0, col - 1);
      const right = Math.min(cols - 1, col + 1);
      const high = Math.max(0, row - 1);
      const low = Math.min(rows - 1, row + 1);

      for (let nr = high; nr <= low; nr++) {
        for (let nc = left; nc <= right; nc++) {
          if (newBoard[nr][nc].type === CELL_TYPE.MINE) {
            counter++;
          }
        }
      }
      newBoard[row][col].neighborMines = counter;
    }
  }

  return newBoard;
};

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

  // Підрахунок кількості прапорців та безпечних клітинок (для відображення в шапці)
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

    // Рекурсивне відкриття порожніх клітинок (Flood fill)
    const newBoard = workingBoard.map((row) => row.map((cell) => ({ ...cell })));
    const floodFill = (rowIdx, colIdx) => {
      const stack = [[rowIdx, colIdx]];
      while (stack.length > 0) {
        const [curR, curC] = stack.pop();
        const cell = newBoard[curR][curC];

        if (cell.state === CELL_STATE.CLOSED) {
          cell.state = CELL_STATE.OPEN;
          if (cell.neighborMines === 0) {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = curR + dr;
                const nc = curC + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].state === CELL_STATE.CLOSED) {
                  stack.push([nr, nc]);
                }
              }
            }
          }
        }
      }
    };

    floodFill(r, c);

    // Перевірка на перемогу безпосередньо в обробнику події (уникнення setState всередині useEffect)
    const hasWon = newBoard.flat().every(
      (cell) => cell.type === CELL_TYPE.MINE || cell.state === CELL_STATE.OPEN
    );

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
      {/* Панель вибору складності */}
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

      {/* Ігрове поле */}
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

      {/* Модальне вікно результату гри */}
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