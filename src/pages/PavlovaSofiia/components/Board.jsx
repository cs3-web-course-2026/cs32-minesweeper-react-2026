import Cell from './Cell';

import styles from './Board.module.css';

export default function Board({ board, onOpen, onFlag }) {
  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            row={rowIndex}
            col={colIndex}
            onOpen={onOpen}
            onFlag={onFlag}
          />
        )),
      )}
    </div>
  );
}
