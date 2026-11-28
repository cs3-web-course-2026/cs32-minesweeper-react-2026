export default function RestartButton({ status, onRestart, className }) {
  let smiley = '🙂';
  if (status === 'won') {
    smiley = '😎';
  } else if (status === 'lost') {
    smiley = '😵';
  }
  return (
    <button type="button" className={className} aria-label="Restart game" onClick={onRestart}>
      <span aria-hidden="true">{smiley}</span>
    </button>
  );
}
