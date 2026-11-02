import CounterDisplay from './CounterDisplay';

function FlagCounter({ remainingFlags }) {
  return (
    <CounterDisplay
      icon="🚩"
      value={remainingFlags}
      title="Залишилось прапорців"
      variant="flag"
      role="status"
      ariaLive="polite"
    />
  );
}

export default FlagCounter;
