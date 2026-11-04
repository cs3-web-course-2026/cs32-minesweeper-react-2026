export default function RestartButton({ status, onRestart, className }) {
  const smiley = status === 'won' ? '😎' : status === 'lost' ? '😵' : '🙂';
  return (
    <button type="button" className={className} aria-label="Restart game" onClick={onRestart}>
      <span aria-hidden="true">{smiley}</span>
    </button>
  );
}
