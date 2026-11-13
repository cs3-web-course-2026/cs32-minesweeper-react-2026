export default function Timer({ seconds, className, iconClassName }) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainder = String(seconds % 60).padStart(2, '0');
  return (
    <div className={className} role="timer" aria-label={`Elapsed time: ${minutes} minutes ${remainder} seconds`}>
      <span className={iconClassName} aria-hidden="true">⏰</span>
      <span>{minutes}:{remainder}</span>
    </div>
  );
}
