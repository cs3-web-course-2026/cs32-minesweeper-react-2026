function GameStatus({ status }) {
  if (status === 'won') return <h2>🎉 Ви перемогли!</h2>;
  if (status === 'lost') return <h2>💥 Гру завершено. Ви програли!</h2>;

  return <h2>Гра триває</h2>;
}

export default GameStatus;