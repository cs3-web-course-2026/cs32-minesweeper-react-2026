import Cell from './Cell';
import styles from '../KhomiakovOleksii.module.css';

export default function Board({ board, gameStatus, onOpenCell, onToggleFlag }) {
  return (
    <section className={styles.gameBoard} aria-label="Ігрове поле Minesweeper">
      {board.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className={styles.boardRow}>
          {row.map((cell) => (
            <Cell
              key={cell.id}
              cellData={cell}
              gameStatus={gameStatus}
              onOpen={onOpenCell}
              onToggleFlag={onToggleFlag}
            />
          ))}
        </div>
      ))}
    </section>
  );
}