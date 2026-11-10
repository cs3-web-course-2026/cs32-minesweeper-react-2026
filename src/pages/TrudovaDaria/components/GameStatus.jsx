import { GAME_STATUS, MESSAGES } from "../constants/game";

import styles from "./GameStatus.module.css";

function getStatusMessage(gameStatus, elapsedSeconds, isFlagLimitReached) {
  switch (gameStatus) {
    case GAME_STATUS.WON:
      return `Вітаємо! Перемога за ${elapsedSeconds} с.`;
    case GAME_STATUS.LOST:
      return MESSAGES.LOST;
    default:
      return isFlagLimitReached ? MESSAGES.FLAG_LIMIT : MESSAGES.DEFAULT;
  }
}

function GameStatus({ gameStatus, elapsedSeconds, isFlagLimitReached }) {
  const className = [
    styles.message,
    gameStatus === GAME_STATUS.WON ? styles.win : "",
    gameStatus === GAME_STATUS.LOST ? styles.lose : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <p className={className} role="status" aria-live="polite">
      {getStatusMessage(gameStatus, elapsedSeconds, isFlagLimitReached)}
    </p>
  );
}

export default GameStatus;
