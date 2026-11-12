import React from 'react';

const GameStatus = ({ status, className }) => {
  let message = 'Хай щастить!';
  if (status === 'win') message = 'Вітаємо! Усі безпечні клітинки відкрито!';
  if (status === 'lose') message = 'Гра закінчена: Ви підірвались на міні!';

  return (
    <div className={className} role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default GameStatus;