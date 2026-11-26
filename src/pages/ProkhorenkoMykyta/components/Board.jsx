import { GAME_STATUS } from '../constants/game';
import CellButton from './CellButton';
import styles from './Board.module.css';


function Board({ board, status, onReveal, onFlag }) {
  const rowsCount = board.length;
  const colsCount = board[0].length;
  const isGameLost = status === GAME_STATUS.LOSE;
  const isGameOver = isGameLost || status === GAME_STATUS.WIN;

  return (
    <div
      className={styles.board}
      role="group"
      aria-label={`Ігрове поле ${rowsCount} на ${colsCount}`}
    >
      {board.map((boardRow, row) =>
        boardRow.map((cell, col) => (
          <CellButton
            key={`${row}-${col}`}
            cell={cell}
            row={row}
            col={col}
            isGameLost={isGameLost}
            isDisabled={isGameOver}
            onReveal={onReveal}
            onFlag={onFlag}
          />
        )),
      )}
    </div>
  );
}

export default Board;
