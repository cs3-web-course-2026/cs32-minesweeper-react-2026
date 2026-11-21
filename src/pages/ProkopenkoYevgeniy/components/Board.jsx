import { memo } from 'react';

import { GAME_CONFIG, GAME_STATUS } from '../constants/game';
import CellButton from './CellButton';

import styles from './Board.module.css';

function Board({ board, gameStatus, explodedCell, onReveal, onFlag }) {
  const isLost = gameStatus === GAME_STATUS.LOST;
  const colsCount = board.length > 0 ? board[0].length : GAME_CONFIG.COLS;

  return (
    <div
      className={styles.board}
      style={{ '--cols-count': colsCount }}
      role="grid"
      aria-label="Ігрове поле Сапера"
    >
      {board.map((boardRow, row) => (
        <div key={`row-${row}`} role="row" className={styles.boardRow}>
          {boardRow.map((cell, col) => {
            const isExploded =
              explodedCell?.row === row && explodedCell?.col === col;

            return (
              <CellButton
                key={`${row}-${col}`}
                cell={cell}
                row={row}
                col={col}
                isExploded={isExploded}
                isLost={isLost}
                onReveal={onReveal}
                onFlag={onFlag}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default memo(Board);
