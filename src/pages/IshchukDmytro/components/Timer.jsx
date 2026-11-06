export default function Timer({ seconds }) {
  const minutesPart = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secondsPart = String(seconds % 60).padStart(2, '0');

  return (
    <time dateTime={`PT${seconds}S`} aria-label={`Час гри: ${minutesPart}:${secondsPart}`}>
      {minutesPart}:{secondsPart}
    </time>
  );
}
