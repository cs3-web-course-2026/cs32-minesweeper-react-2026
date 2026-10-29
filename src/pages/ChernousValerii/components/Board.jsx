import CellButton from './CellButton';
import styles from './Board.module.css';

function Board({
  board,
  gameStatus,
  explodedCell,
  onCellClick,
  onCellContextMenu,
  onCellKeyDown,
}) {
  return (
    <div className={styles.board}>
      {board.map((rowCells, rowIndex) =>
        rowCells.map((cell, colIndex) => {
          const isExploded =
            explodedCell !== null &&
            explodedCell.row === rowIndex &&
            explodedCell.col === colIndex;

          return (
            <CellButton
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              gameStatus={gameStatus}
              isExploded={isExploded}
              onClick={onCellClick}
              onContextMenu={onCellContextMenu}
              onKeyDown={onCellKeyDown}
            />
          );
        }),
      )}
    </div>
  );
}

export default Board;
