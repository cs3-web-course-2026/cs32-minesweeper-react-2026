import { Cell } from '../Cell/Cell';
import styles from './Board.module.css';

export function Board({ board, onCellClick, onCellContextMenu }) {
  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            data={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onContextMenu={(e) => {
              e.preventDefault();
              onCellContextMenu(rowIndex, colIndex);
            }}
          />
        ))
      )}
    </div>
  );
}