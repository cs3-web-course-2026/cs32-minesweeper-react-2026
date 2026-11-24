const MESSAGES = {
  idle: '',
  playing: '',
  won: '🎉 You win! All safe cells opened.',
  lost: '💥 Game over! Try again.',
};

export default function GameStatus({ status, className }) {
  return <div className={className} role="status" aria-live="polite">{MESSAGES[status]}</div>;
}
