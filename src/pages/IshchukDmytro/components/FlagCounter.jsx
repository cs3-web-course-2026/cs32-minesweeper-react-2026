export default function FlagCounter({ flagsLeft }) {
  return (
    <span role="status" aria-label={`Залишилось прапорців: ${flagsLeft}`}>
      ⚑ {String(flagsLeft).padStart(2, '0')}
    </span>
  );
}
