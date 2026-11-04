import Cell from "./Cell";
import styles from "./Board.module.css";

export default function Board({ board, onOpen, onToggleFlag, disabled }) {
  return (
    <main className={styles.board} aria-label="Игровое поле">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            row={rowIndex}
            col={colIndex}
            onOpen={onOpen}
            onToggleFlag={onToggleFlag}
            disabled={disabled}
          />
        ))
      )}
    </main>
  );
}
