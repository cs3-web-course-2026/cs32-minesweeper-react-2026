import CounterDisplay from './CounterDisplay';
import { formatTime } from '../utils/board';

function Timer({ time }) {
  return (
    <CounterDisplay
      icon="⏱️"
      value={formatTime(time)}
      title="Час гри"
      variant="timer"
    />
  );
}

export default Timer;
