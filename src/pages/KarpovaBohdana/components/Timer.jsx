import CounterDisplay from './CounterDisplay';


function Timer({ seconds }) {
  return (
    <CounterDisplay
      caption="Час"
      value={seconds}
      label={`Час гри: ${seconds} с`}
      role="timer"
    />
  );
}

export default Timer;
