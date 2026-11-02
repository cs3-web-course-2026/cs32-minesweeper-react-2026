import { GAME_STATUS } from '../utils/gameLogic';

import styles from './GameStatus.module.css';

function GameStatus({ status }) {
  let message = '';
  let toneClass = '';

  if (status === GAME_STATUS.WIN) {
    message = 'Victory!';
    toneClass = styles.win;
  } else if (status === GAME_STATUS.LOSE) {
    message = 'Game over.';
    toneClass = styles.lose;
  }

  return (
    <p
      role="status"
      aria-live="polite"
      className={[styles.message, toneClass].filter(Boolean).join(' ')}
    >
      {message}
    </p>
  );
}

export default GameStatus;