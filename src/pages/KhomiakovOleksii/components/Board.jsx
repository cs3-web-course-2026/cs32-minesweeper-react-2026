import Cell from './Cell';
import styles from '../KhomiakovOleksii.module.css';

export default function Board({ board, gameStatus, onOpenCell, onToggleFlag }) {
  return (
    <main className={styles.gameBoard} aria-label="Ігрове поле Minesweeper">
      {board.map((row) =>
        row.map((cell) => (
          <Cell
            key={cell.id}
            cell={cell}
            gameStatus={gameStatus}
            onOpen={onOpenCell}
            onToggleFlag={onToggleFlag}
          />
        ))
      )}
    </main>
  );
}