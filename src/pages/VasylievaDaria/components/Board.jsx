
import CellButton from './CellButton';

import styles from '../Minesweeper.module.css';

export default function Board({
                                board,
                                explodedCell,
                                onReveal,
                                onFlag,
                              }) {
  return (
    <div
      className={styles.grid}
      role="group"
      aria-label="Ігрове поле Сапера"
    >
      {board.map((boardRow, row) =>
        boardRow.map((cell, col) => (
          <CellButton
            key={`${row}-${col}`}
            cell={cell}
            row={row}
            col={col}
            isExploded={
              explodedCell?.row === row &&
              explodedCell?.col === col
            }
            onReveal={onReveal}
            onFlag={onFlag}
          />
        ))
      )}
    </div>
  );
}
