import Cell from './Cell';
import styles from './Board.module.css';

export default function Board({ board, onOpen, onFlag }) {
  return (
    <div
      className={styles.board}
      style={{ '--cols': board[0].length }}
      aria-label="Ігрове поле Сапер"
      role="group"
    >
      {board.map((rowCells, row) =>
        rowCells.map((cell, col) => (
          <Cell
            key={`${row}-${col}`}
            cell={cell}
            row={row}
            col={col}
            onOpen={onOpen}
            onFlag={onFlag}
          />
        )),
      )}
    </div>
  );
}
