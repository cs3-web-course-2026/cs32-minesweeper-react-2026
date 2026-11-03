export default function GameStatus({ status, time }) {
  if (status === 'process') {
    return null;
  }

  return (
    <h2>
      {status === 'win'
        ? `You won in ${time} seconds!`
        : 'Game Over! You hit a mine.'}
    </h2>
  );
}
