import CellButton from './CellButton';

import styles from './Board.module.css';


function Board({ board, isFinished, onCellOpen, onCellFlag }) {
  const boardSize = {
    '--board-rows': board.length,
    '--board-columns': board[0].length,
  };

  return (
    <div
      className={styles.board}
      style={boardSize}
      role="group"
      aria-label="Ігрове поле"
    >
      {board.map((cells, row) =>
        cells.map((cell, col) => (
          <CellButton
            key={`${row}-${col}`}
            cell={cell}
            row={row}
            col={col}
            isFinished={isFinished}
            onOpen={onCellOpen}
            onFlag={onCellFlag}
          />
        )),
      )}
    </div>
  );
}

export default Board;
