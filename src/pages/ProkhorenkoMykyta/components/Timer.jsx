import Counter from './Counter';

const TIMER_ICON = '⏱️';


function Timer({ seconds }) {
  return <Counter icon={TIMER_ICON} label="Час гри, секунд:" value={seconds} />;
}

export default Timer;
