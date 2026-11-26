import { COUNTER_DIGITS } from '../constants/game';


export function formatCounter(value) {
  return String(Math.max(value, 0)).padStart(COUNTER_DIGITS, '0');
}
