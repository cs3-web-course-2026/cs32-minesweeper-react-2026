import { TIMER_DIGITS } from "../constants/game";

import StatDisplay from "./StatDisplay";

function Timer({ elapsedSeconds }) {
  const formattedTime = String(elapsedSeconds).padStart(TIMER_DIGITS, "0");

  return <StatDisplay label="Час" value={formattedTime} />;
}

export default Timer;
