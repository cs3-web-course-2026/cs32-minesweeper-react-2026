import { SECONDS_PER_MINUTE } from '../constants/game';
import Counter from './Counter';


function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = String(totalSeconds % SECONDS_PER_MINUTE).padStart(2, '0');

  return `${minutes}:${seconds}`;
}


function Timer({ gameTime }) {
  return (
    <Counter icon="⏰" label="Time">
      <time dateTime={`PT${gameTime}S`}>{formatTime(gameTime)}</time>
    </Counter>
  );
}


export default Timer;
