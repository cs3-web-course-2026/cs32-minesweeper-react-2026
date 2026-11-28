import React from 'react';
import { Cell } from '../Cell/Cell';
import styles from './Board.module.css';

export const Board = ({ board, gameStatus, onCellClick, onCellRightClick }) => {
  return (
    <section className={styles.vikingGrid} role="grid">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} role="row" style={{ display: 'contents' }}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              cell={cell}
              gameStatus={gameStatus}
              onClick={onCellClick}
              onContextMenu={onCellRightClick}
            />
          ))}
        </div>
      ))}
    </section>
  );
};
