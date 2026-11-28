import Cell from './Cell';
import styles from './Board.module.css';

export default function Board({ board, cols, gameStatus, onOpenCell, onToggleFlag }) {
  return (
    <section
      className={styles.gameBoard}
      style={{ '--board-width': cols }}
      aria-label="Ігрове поле"
    >
      {board.map((row) =>
        row.map((cell) => (
          <Cell
            key={`${cell.row}-${cell.col}`}
            cell={cell}
            gameStatus={gameStatus}
            onOpen={onOpenCell}
            onToggleFlag={onToggleFlag}
          />
        ))
      )}
    </section>
  );
}