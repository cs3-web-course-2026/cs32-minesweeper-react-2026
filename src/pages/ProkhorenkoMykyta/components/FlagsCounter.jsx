import { CELL_ICON } from '../constants/game';
import Counter from './Counter';


function FlagsCounter({ flagsLeft }) {
  return (
    <Counter
      icon={CELL_ICON.FLAG}
      label="Залишилось прапорців:"
      value={flagsLeft}
      isLive
    />
  );
}

export default FlagsCounter;
