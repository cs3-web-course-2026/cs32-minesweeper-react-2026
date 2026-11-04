import { useState, useEffect } from 'react';
import styles from './MockGame.module.css';

const ROWS = 9;
const COLS = 9;
const MINE_COUNT = 10;
const STATUS_LABEL = {
  playing: 'Playing',
  won: 'Won!',
  lost: 'Game Over',
};

function createEmptyBoard() {
  return Array(ROWS)
    .fill(null)
    .map(() =>
      Array(COLS)
        .fill(null)
        .map(() => ({
          isRevealed: false,
          isMine: false,
          isFlagged: false,
          neighborCount: 0,
        })),
    );
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function MockGame() {
  const [board, setBoard] = useState(createEmptyBoard);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const mineCount = MINE_COUNT;
  const [time, setTime] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  // Timer
  useEffect(() => {
    let interval = null;
    if (gameStatus === 'playing') {
      interval = setInterval(() => {
        setTime((previousTime) => previousTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus]);

  const initializeBoard = () => {
    setBoard(createEmptyBoard());
    setGameStatus('playing');
    setTime(0);
    setIsFirstClick(true);
  };

  const placeMines = (clickedRow, clickedCol) => {
    const newBoard = [...board];
    let minesPlaced = 0;

    while (minesPlaced < mineCount) {
      const row = getRandomInt(ROWS);
      const col = getRandomInt(COLS);

      if (
        !newBoard[row][col].isMine &&
        !(row === clickedRow && col === clickedCol)
      ) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor counts
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (
                newRow >= 0 &&
                newRow < ROWS &&
                newCol >= 0 &&
                newCol < COLS
              ) {
                if (newBoard[newRow][newCol].isMine) {
                  count++;
                }
              }
            }
          }
          newBoard[row][col].neighborCount = count;
        }
      }
    }

    setBoard(newBoard);
  };

  const handleCellClick = (row, col) => {
    if (
      gameStatus !== 'playing' ||
      board[row][col].isRevealed ||
      board[row][col].isFlagged
    ) {
      return;
    }

    if (isFirstClick) {
      placeMines(row, col);
      setIsFirstClick(false);
    }

    const newBoard = [...board];
    newBoard[row][col].isRevealed = true;

    if (newBoard[row][col].isMine) {
      // Game over - reveal all mines
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true;
          }
        }
      }
      setGameStatus('lost');
    } else if (newBoard[row][col].neighborCount === 0) {
      // Auto-reveal neighbors for empty cells
      revealNeighbors(row, col, newBoard);
    }

    setBoard(newBoard);
    checkWinCondition(newBoard);
  };

  const revealNeighbors = (row, col, currentBoard) => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
          if (
            !currentBoard[newRow][newCol].isRevealed &&
            !currentBoard[newRow][newCol].isFlagged
          ) {
            currentBoard[newRow][newCol].isRevealed = true;
            if (currentBoard[newRow][newCol].neighborCount === 0) {
              revealNeighbors(newRow, newCol, currentBoard);
            }
          }
        }
      }
    }
  };

  const handleRightClick = (e, row, col) => {
    e.preventDefault();
    if (gameStatus !== 'playing' || board[row][col].isRevealed) {
      return;
    }

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  };

  const checkWinCondition = (currentBoard) => {
    let revealedCount = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (currentBoard[row][col].isRevealed && !currentBoard[row][col].isMine) {
          revealedCount++;
        }
      }
    }

    if (revealedCount === ROWS * COLS - mineCount) {
      setGameStatus('won');
    }
  };

  const getCellContent = (cell) => {
    if (!cell.isRevealed) {
      return cell.isFlagged ? '🚩' : '';
    }
    if (cell.isMine) {
      return '💣';
    }
    return cell.neighborCount > 0 ? cell.neighborCount : '';
  };

  const getCellClass = (cell) => {
    const classes = [styles.cell];
    if (cell.isRevealed) {
      classes.push(styles.revealed);
      if (cell.isMine) {
        classes.push(styles.mine);
      } else if (cell.neighborCount > 0) {
        classes.push(styles[`number${cell.neighborCount}`]);
      }
    } else {
      classes.push(styles.hidden);
      if (cell.isFlagged) {
        classes.push(styles.flagged);
      }
    }
    return classes.join(' ');
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <h1>Mock Minesweeper Game</h1>
        <p>This is an example implementation to demonstrate the system</p>
      </div>

      <div className={styles.gameInfo}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Mines:</span>
          <span className={styles.value}>{mineCount}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Time:</span>
          <span className={styles.value}>{time}s</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Status:</span>
          <span className={`${styles.value} ${styles[gameStatus]}`}>
            {STATUS_LABEL[gameStatus]}
          </span>
        </div>
      </div>

      <div className={styles.gameBoard}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => (
              <button
                type="button"
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(cell)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                disabled={gameStatus !== 'playing'}
              >
                {getCellContent(cell)}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.gameControls}>
        <button
          type="button"
          className={styles.newGameBtn}
          onClick={initializeBoard}
        >
          New Game
        </button>
        <div className={styles.instructions}>
          <p>
            <strong>Instructions:</strong>
          </p>
          <ul>
            <li>Left-click to reveal cells</li>
            <li>Right-click to flag/unflag cells</li>
            <li>Numbers show mine count in adjacent cells</li>
            <li>Clear all non-mine cells to win!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MockGame;
