import React from 'react';
import CellButton from './CellButton';
import styles from '../Game.module.css';

export default function Board({ board, cols, gameState, clickedMine, activeCell, openCell, toggleFlag }) {
  return (
    <div className={styles.board} style={{ '--board-columns': cols }}>
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <CellButton
            key={`${rIdx}-${cIdx}`}
            cell={cell}
            rIdx={rIdx}
            cIdx={cIdx}
            gameState={gameState}
            clickedMine={clickedMine}
            activeCell={activeCell}
            openCell={openCell}
            toggleFlag={toggleFlag}
          />
        ))
      )}
    </div>
  );
}