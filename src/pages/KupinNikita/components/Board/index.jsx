import Cell from '../Cell';
import styles from './Board.module.css';

function Board({ board, onCellClick, onCellRightClick }) {
  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onContextMenu={(event) =>
              onCellRightClick(event, rowIndex, colIndex)
            }
          />
        ))
      )}
    </div>
  );
}

export default Board;