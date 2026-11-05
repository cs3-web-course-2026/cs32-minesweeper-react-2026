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
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <Cell
            key={`${rIdx}-${cIdx}`}
            data={cell}
            onClick={() => onCellClick(rIdx, cIdx)}
            onContextMenu={(e) => {
              e.preventDefault();
              onCellRightClick(rIdx, cIdx);
            }}
          />
        ))
      )}
    </main>
  );
};

export default Board;