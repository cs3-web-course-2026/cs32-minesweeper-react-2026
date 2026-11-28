import Cell from './Cell';

import styles from './Board.module.css';

function Board({
  board,
  onOpen,
  onFlag,
  explodedMine,
  disabled,
}) {
  // Динамічно отримуємо кількість колонок із даних дошки
  const colsCount = board && board.length > 0 ? board[0].length : 10;

  return (
    <div 
      className={styles.board} 
      style={{ '--board-cols': colsCount }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isExploded =
            explodedMine?.row === rowIndex &&
            explodedMine?.col === colIndex;

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              onOpen={onOpen}
              onFlag={onFlag}
              exploded={isExploded}
              disabled={disabled}
            />
          );
        })
      )}
    </div>
  );
}

export default Board;