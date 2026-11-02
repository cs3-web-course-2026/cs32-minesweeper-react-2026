import { GAME_STATUS } from '../utils/gameLogic';

import styles from './GameStatus.module.css';

function GameStatus({ status }) {
  if (status === GAME_STATUS.WIN) {
    return (
      <p className={`${styles.message} ${styles.win}`}>
        Victory!
      </p>
    );
  }

  if (status === GAME_STATUS.LOSE) {
    return (
      <p className={`${styles.message} ${styles.lose}`}>
        Game over.
      </p>
    );
  }

  return null;
}

export default GameStatus;