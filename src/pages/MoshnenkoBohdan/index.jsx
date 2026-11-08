import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Game.module.css';

const GAME_STATUS = {
  PROCESS: 'process',
  WIN: 'win',
  LOSE: 'lose'
};

const CELL_TYPE = {
  EMPTY: 'empty',
  MINE: 'mine'
};

const CELL_STATE = {
  CLOSED: 'closed',
  OPENED: 'opened',
  FLAGGED: 'flagged'
};

const DIFFICULTIES = {
  easy: { rows: 8, cols: 8, mines: 10, label: 'Легкий' },
  medium: { rows: 10, cols: 10, mines: 15, label: 'Средний' },
  hard: { rows: 12, cols: 12, mines: 25, label: 'Сложный' }
};

export default function MoshnenkoBohdanGame() {
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const [gameState, setGameState] = useState({
    rows: 8,
    cols: 8,
    minesCount: 10,
    status: GAME_STATUS.PROCESS,
    gameTime: 0
  });

  const [board, setBoard] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

  const timerRef = useRef(null);
  const boardElementRef = useRef(null);

  const initGame = useCallback((difficultyKey) => {
    const { rows, cols, mines } = DIFFICULTIES[difficultyKey];
    setCurrentDifficulty(difficultyKey);
    clearInterval(timerRef.current);

    let newBoard = [];
    for (let r = 0; r < rows; r++) {
      newBoard[r] = [];
      for (let c = 0; c < cols; c++) {
        newBoard[r][c] = {
          type: CELL_TYPE.EMPTY,
          state: CELL_STATE.CLOSED,
          neighborMines: 0
        };
      }
    }

    let minesPlanted = 0;
    while (minesPlanted < mines) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
      if (newBoard[randomRow][randomCol].type === CELL_TYPE.EMPTY) {
        newBoard[randomRow][randomCol].type = CELL_TYPE.MINE;
        minesPlanted++;
      }
    }

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
            if (nr === row && nc === col) continue;
            if (newBoard[nr][nc].type === CELL_TYPE.MINE) {
              counter++;
            }
          }
        }
        newBoard[row][col].neighborMines = counter;
      }
    }

    setBoard(newBoard);
    setGameState({
      rows,
      cols,
      minesCount: mines,
      status: GAME_STATUS.PROCESS,
      gameTime: 0
    });
    setModal({ isOpen: false, title: '', message: '' });
  }, []);

  // Автоматический запуск при первой загрузке
  useEffect(() => {
    initGame('easy');
  }, [initGame]);

  // Таймер
  useEffect(() => {
    if (gameState.status === GAME_STATUS.PROCESS) {
      timerRef.current = setInterval(() => {
        setGameState(prev => ({ ...prev, gameTime: prev.gameTime + 1 }));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState.status]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const getFlaggedCount = () => {
    let count = 0;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col].state === CELL_STATE.FLAGGED) count++;
      }
    }
    return count;
  };

  const getSafeCellsRemaining = () => {
    let count = 0;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col].type === CELL_TYPE.EMPTY && board[row][col].state !== CELL_STATE.OPENED) count++;
      }
    }
    return count;
  };

  const revealAllMines = (currentBoard) => {
    return currentBoard.map(row =>
      row.map(cell => ({
        ...cell,
        state: cell.type === CELL_TYPE.MINE ? CELL_STATE.OPENED : cell.state
      }))
    );
  };

  const floodFill = (boardData, r, c, rows, cols) => {
    if (
      r < 0 || r >= rows || c < 0 || c >= cols ||
      boardData[r][c].state === CELL_STATE.OPENED ||
      boardData[r][c].state === CELL_STATE.FLAGGED
    ) {
      return;
    }

    boardData[r][c].state = CELL_STATE.OPENED;

    if (boardData[r][c].neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            floodFill(boardData, r + dr, c + dc, rows, cols);
          }
        }
      }
    }
  };

  const handleCellClick = (row, col) => {
    if (gameState.status !== GAME_STATUS.PROCESS) return;
    const cell = board[row][col];
    if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) return;

    const newBoard = board.map(r => r.map(c => ({ ...c })));

    if (cell.type === CELL_TYPE.MINE) {
      const revealedBoard = revealAllMines(newBoard);
      revealedBoard[row][col].state = CELL_STATE.OPENED;
      setBoard(revealedBoard);
      setGameState(prev => ({ ...prev, status: GAME_STATUS.LOSE }));
      clearInterval(timerRef.current);
      setModal({ isOpen: true, title: 'Game Over', message: 'You hit a mine and lost the game!' });
      return;
    }

    floodFill(newBoard, row, col, gameState.rows, gameState.cols);

    let safeRemaining = 0;
    for (let r = 0; r < gameState.rows; r++) {
      for (let c = 0; c < gameState.cols; c++) {
        if (newBoard[r][c].type === CELL_TYPE.EMPTY && newBoard[r][c].state !== CELL_STATE.OPENED) {
          safeRemaining++;
        }
      }
    }

    setBoard(newBoard);

    if (safeRemaining === 0) {
      setGameState(prev => ({ ...prev, status: GAME_STATUS.WIN }));
      clearInterval(timerRef.current);
      setModal({ isOpen: true, title: 'Victory!', message: 'Congratulations, you successfully cleared all safe cells!' });
    }
  };

  const handleRightClick = (e, row, col) => {
    e.preventDefault();
    if (gameState.status !== GAME_STATUS.PROCESS) return;
    const cell = board[row][col];
    if (cell.state === CELL_STATE.OPENED) return;

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].state = cell.state === CELL_STATE.FLAGGED ? CELL_STATE.CLOSED : CELL_STATE.FLAGGED;
    setBoard(newBoard);
  };

  const currentMinesLeft = gameState.minesCount - getFlaggedCount();
  const safeCellsLeft = getSafeCellsRemaining();

  return (
    <div className={styles.wrapper}>
      <div className={styles.gameContainer}>
        {/* Верхняя панель с кнопками сложности и информацией */}
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
              <span className={styles.infoLabel}>Mines:</span> {currentMinesLeft}
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

        {/* Игровое поле */}
        <div
          ref={boardElementRef}
          className={styles.board}
          style={{ gridTemplateColumns: `repeat(${gameState.cols}, var(--cell-size))` }}
        >
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              let content = '';
              let cellClasses = [styles.cell];

              if (cell.state === CELL_STATE.OPENED) {
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

              const ariaLabel = `Row ${rIdx + 1}, column ${cIdx + 1}, ${cell.state}`;

              return (
                <button
                  type="button"
                  key={`${rIdx}-${cIdx}`}
                  className={cellClasses.join(' ')}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  onContextMenu={(e) => handleRightClick(e, rIdx, cIdx)}
                  aria-label={ariaLabel}
                >
                  {content}
                </button>
              );
            })
          )}
        </div>
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