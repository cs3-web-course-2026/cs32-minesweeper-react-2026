
import styles from '../Game.module.css';

const STATUS_MESSAGES = {
  ready: 'Відкрий клітинку, щоб почати гру',
  playing: 'Гра триває',
  win: 'Перемога! Усі безпечні клітинки відкрито!',
  lose: 'Гру завершено! Ти натрапив на міну.',
};

function GameStatus({ status }) {
  const message = STATUS_MESSAGES[status] ?? STATUS_MESSAGES.ready;

  return (
    <p
      className={[
        styles.gameStatus,
        status === 'win' ? styles.gameStatusWin : '',
        status === 'lose' ? styles.gameStatusLose : '',
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
