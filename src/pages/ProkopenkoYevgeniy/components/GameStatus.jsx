import { GAME_STATUS } from '../constants/game';

import styles from './GameStatus.module.css';

function getStatusMessage(gameStatus, elapsedSeconds, remainingMines) {
  if (gameStatus === GAME_STATUS.WON) {
    return `Перемога! Усі міни знешкоджено за ${elapsedSeconds} с. Залишок мін: ${remainingMines}.`;
  }

  if (gameStatus === GAME_STATUS.LOST) {
    return `Поразка! Ви натрапили на міну. Залишок мін: ${remainingMines}.`;
  }

  return '';
}


function GameStatus({ gameStatus, elapsedSeconds, remainingMines }) {
  const message = getStatusMessage(gameStatus, elapsedSeconds, remainingMines);

  const bannerClassName = message
    ? [
        styles.statusBanner,
        gameStatus === GAME_STATUS.WON ? styles.win : '',
        gameStatus === GAME_STATUS.LOST ? styles.lose : '',
      ]
        .filter(Boolean)
        .join(' ')
    : styles.visuallyHidden;

  return (
    <p className={bannerClassName} role="status" aria-live="polite">
      {message}
    </p>
  );
}

export default GameStatus;

