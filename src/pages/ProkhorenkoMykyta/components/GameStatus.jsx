import { GAME_STATUS } from '../constants/game';
import styles from './GameStatus.module.css';

const STATUS_CLASS = {
  [GAME_STATUS.WIN]: styles.win,
  [GAME_STATUS.LOSE]: styles.lose,
};


function getStatusMessage(status, gameTime) {
  if (status === GAME_STATUS.WIN) {
    return `Перемога! Усі безпечні клітинки відкрито за ${gameTime} с.`;
  }

  if (status === GAME_STATUS.LOSE) {
    return 'Ви натрапили на міну! Натисніть «Нова гра», щоб спробувати ще раз.';
  }

  return 'Ліва кнопка — відкрити клітинку, права — поставити прапорець.';
}


function GameStatus({ status, gameTime }) {
  const className = [styles.message, STATUS_CLASS[status]]
    .filter(Boolean)
    .join(' ');

  return (
    <p className={className} role="status" aria-live="polite">
      {getStatusMessage(status, gameTime)}
    </p>
  );
}

export default GameStatus;
