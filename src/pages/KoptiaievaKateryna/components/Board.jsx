import CellButton from './CellButton';

import styles from './Board.module.css';


function Board({ board, status, onOpenCell, onFlagCell }) {
  return (
    <section
      className={styles.board}
      style={{ '--board-columns': board[0].length }}
      aria-label="Minefield"
    >
      {board.map((rowCells, row) =>
        rowCells.map((cell, col) => (
          <CellButton
            key={`${row}-${col}`}
            cell={cell}
            row={row}
            col={col}
            status={status}
            onOpen={onOpenCell}
            onFlag={onFlagCell}
          />
        )),
      )}
    </section>
  );
}


export default Board;
