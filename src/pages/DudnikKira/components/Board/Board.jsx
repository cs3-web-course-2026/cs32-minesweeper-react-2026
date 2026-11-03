import React from 'react';
import Cell from '../Cell/Cell';
import styles from './Board.module.css';

export default function Board({ board, onCellClick, onCellContextMenu }) {
    return (
      <main className={styles['game-board']}>
          {board.map((row, rIndex) =>
            row.map((cell, cIndex) => (
              <Cell
                key={`${rIndex}-${cIndex}`}
                cellData={cell}
                onClick={() => onCellClick(rIndex, cIndex)}
                onContextMenu={(e) => onCellContextMenu(e, rIndex, cIndex)}
              />
            ))
          )}
      </main>
    );
}