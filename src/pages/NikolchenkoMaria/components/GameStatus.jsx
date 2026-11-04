import styles from '../Game.module.css';
import { GAME_STATUS } from '../utils/constants';

const STATUS_MESSAGES = {
  [GAME_STATUS.READY]: 'Натисни на клітинку, щоб почати гру.',
  [GAME_STATUS.PLAYING]: 'Гра триває.',
  [GAME_STATUS.WIN]: 'Перемога! Усі безпечні клітинки відкрито!',
  [GAME_STATUS.LOSE]: 'Гру завершено! Ти натрапив на міну.',
};

function GameStatus({ status }) {
  const message = STATUS_MESSAGES[status] ?? STATUS_MESSAGES.ready;

  return (
    <p
      className={[
        styles.gameStatus,
        status === GAME_STATUS.WIN ? styles.gameStatusWin : '',
        status === GAME_STATUS.LOSE ? styles.gameStatusLose : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
    >
      {message}
    </p>
  );
}

export default GameStatus;
