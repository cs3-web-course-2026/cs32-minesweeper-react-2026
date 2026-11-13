import { memo } from 'react';
import Cell from './Cell.jsx';
import styles from './Board.module.css';

function Board({ board, rows, cols, status, onReveal, onToggleFlag }) {
  const finished = status === 'won' || status === 'lost';
  return (
    <main
      className={styles.board}
      style={{ '--board-size': cols }}
      role="group"
      aria-label={`Minesweeper board: ${rows} rows, ${cols} columns`}
    >
      {board.map((cell) => (
        <Cell
          key={cell.id}
          cell={cell}
          cols={cols}
          finished={finished}
          lost={status === 'lost'}
          onReveal={onReveal}
          onToggleFlag={onToggleFlag}
        />
      ))}
    </main>
  );
}

export default memo(Board);
