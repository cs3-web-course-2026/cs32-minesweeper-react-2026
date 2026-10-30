import CounterDisplay from './CounterDisplay';


function MineCounter({ flagsLeft }) {
  return (
    <CounterDisplay
      caption="Міни"
      value={flagsLeft}
      label={`Залишилось прапорців: ${flagsLeft}`}
      role="status"
    />
  );
}

export default MineCounter;
