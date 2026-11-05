import React from 'react';
import Cell from '../Cell/Cell';
import styles from './Board.module.css';
import { GAME_CONFIG } from '../../constants';

const Board = ({ board, onCellClick, onCellRightClick }) => {
  return (
    <main 
      className={styles.board}
      style={{ gridTemplateColumns: `repeat(${GAME_CONFIG.COLS}, var(--cell-size, 45px))` }}
    >
      {board.map((rowArr, row) =>
        rowArr.map((cell, col) => (
          <Cell
            key={`${row}-${col}`}
            data={cell}
            row={row}
            col={col}
            onClick={() => onCellClick(row, col)}
            onContextMenu={(e) => {
              e.preventDefault();
              onCellRightClick(row, col);
            }}
          />
        ))
      )}
    </main>
  );
};

export default Board;